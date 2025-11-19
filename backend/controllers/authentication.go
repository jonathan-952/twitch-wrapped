package controllers

import (
	"encoding/json"
	// "fmt"
	"io"
	"log"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/jonathan-952/twitch-wrapped/backend/database"
	"github.com/jonathan-952/twitch-wrapped/backend/models"
)

type CodeRequest struct {
	Code string `json:"code"`
	UserID string `json:"userID"`
}

func Authenticate_Token(TwitchSecret, TwitchClient, OAuthToken string) gin.HandlerFunc{
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
		params.Add("redirect_uri", "http://localhost:3000/auth")

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

		getUser, err := NewGetTwitchUserHandler(OAuthToken, TwitchClient, body.UserID)
		
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

		c.JSON(200, gin.H{"status" : "inserted user table into database"})
	}
}