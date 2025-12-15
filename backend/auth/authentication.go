package auth

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/jonathan-952/twitch-wrapped/backend/database"
	"github.com/jonathan-952/twitch-wrapped/backend/models"
	"github.com/jonathan-952/twitch-wrapped/backend/controllers"
)

type CodeRequest struct {
	Code string `json:"code"`
	UserID string `json:"userID"`
}

func Authenticate_Token(TwitchSecret, TwitchClient, OAuthToken, JWT_Secret string) gin.HandlerFunc{
	return func (c *gin.Context) {
		var body CodeRequest

		// this method auto reads the http request coming in and maps the body to our var
		if err := c.BindJSON(&body); err != nil {
			log.Println("BindJSON failed:", err)
			c.JSON(400, gin.H{"error": "invalid request body"})
			return
		}

		params := url.Values{}

		params.Add("client_id", TwitchClient)
		params.Add("client_secret", TwitchSecret)
		params.Add("code", body.Code)
		params.Add("grant_type", "authorization_code")
		params.Add("redirect_uri", "https://twitch-wrapped.vercel.app/auth")

		resp, err := http.PostForm("https://id.twitch.tv/oauth2/token", params)

		if err != nil {
			log.Println("BindJSON failed:", err)
			c.JSON(500, gin.H{"error": "twitch request failed"})
			return
		}
		defer resp.Body.Close()

		data, err := io.ReadAll(resp.Body)

		if err != nil {
			log.Println("BindJSON failed:", err)
			// c.JSON(400, gin.H{"error": "invalid request body"})
			return
		}

		getUser, err := controllers.GetTwitchUserID(OAuthToken, TwitchClient, body.UserID)
		
		if err != nil {
			log.Println("error fetching user id: ", err)
			return
		}

		var tokenResp models.TokenResponse

		if err := json.Unmarshal(data, &tokenResp); err != nil {
			log.Println(err)
			return
		}
		tokenResp.UserID = getUser

		res := database.CreateUser(tokenResp.UserID, tokenResp.Token, tokenResp.RefreshToken, tokenResp.ExpiresAt)

		if res.Error != nil {
			log.Println(res.Error)
			return
		}

		var retrievedUser models.User

		result := database.DB.Where("user_id = ?", tokenResp.UserID).First(&retrievedUser)
		if result.Error != nil {
			log.Fatalf("Failed to retrieve user: %v", result.Error)
		}

		cookie, err := GenerateJWT(retrievedUser.ID, tokenResp.ExpiresAt, JWT_Secret)

		if err != nil {
			c.JSON(500, gin.H{"error": "error generating cookie"})
			return
		}

		c.SetCookie(
			"twitch_auth",
			cookie,
			3600,
			"/",
			"localhost", // Or your actual domain like "example.com"
			false,       // Set to true for HTTPS
			true,        // Set to true to prevent client-side JavaScript access
		
		)
		c.JSON(200, gin.H{"status" : "inserted user table into database"})
	}
}

func RefreshToken(TwitchSecret, TwitchClient, refreshToken string) (*models.TokenResponse, error) {
	resp, err := http.PostForm("https://id.twitch.tv/oauth2/token", 
		url.Values{
		"grant_type":    {"refresh_token"},
		"refresh_token": {refreshToken},
		"client_id":     {TwitchClient},
		"client_secret": {TwitchSecret},
	},
	
	)
	if err != nil {
		// pass error back up to middleware func
		return nil, err
	}
	defer resp.Body.Close()

	var data models.TokenResponse
	json.NewDecoder(resp.Body).Decode(&data)

	return &data, nil
}