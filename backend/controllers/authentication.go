package controllers

import (
	"encoding/json"
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
}

func Authenticate_Token(TwitchSecret, TwitchClient string) gin.HandlerFunc{
	return func (c *gin.Context) {
		var body CodeRequest

		// this method auto reads the http request coming in and maps the body to our var
		if err := c.BindJSON(&body); err != nil {
			log.Println("BindJSON failed:", err)
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

		data, _ := io.ReadAll(resp.Body)

		
		var tokenResp models.TokenResponse

		if err := json.Unmarshal(data, &tokenResp); err != nil {
			log.Println(err)
			return
		}
		

		res := database.CreateUser(tokenResp.UserID, tokenResp.Token, tokenResp.RefreshToken, tokenResp.ExpiresAt)

		if res.Error != nil {
			log.Fatal(res.Error)
			return
		}

		c.JSON(200, gin.H{"status" : "auth token stored in db i think!"})
	}
}