package controllers

import (
	"io"
	"net/http"
	"github.com/gin-gonic/gin"
	"net/url"
	"fmt"

)

type CodeRequest struct {
	Code string `json:"code"`
}

func Authenticate_Token(TwitchSecret, TwitchClient string) gin.HandlerFunc{
	return func (c *gin.Context) {
		var body CodeRequest

		// this method auto reads the http request coming in and maps the body to our var
		if err := c.BindJSON(&body); err != nil {
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
			c.JSON(500, gin.H{"error": "twitch request failed"})
			return
		}
		defer resp.Body.Close()

		data, _ := io.ReadAll(resp.Body)

		fmt.Println(string(data))

		c.JSON(200, gin.H{"status" : string(data)})
	}
}