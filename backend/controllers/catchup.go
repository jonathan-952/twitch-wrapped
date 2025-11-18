package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/jonathan-952/twitch-wrapped/backend/models"
)

func NewGetTwitchUserHandler(twitchToken, twitchClient string) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.Param("user")

		url := fmt.Sprintf("https://api.twitch.tv/helix/users?login=%s", user)

		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
			return
		}

		req.Header.Set("Authorization", "Bearer "+twitchToken)
		req.Header.Set("Client-Id", twitchClient)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Twitch API"})
			return
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
			return
		}

		var result map[string]interface{}
		if err := json.Unmarshal(body, &result); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse JSON"})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}

func GetFollowedChannels(twitchToken, twitchClient string) gin.HandlerFunc {
	return func(c *gin.Context) {
		allFollows := []models.FollowData{}
		cursor := ""
		user_id := c.Param("user")
		for {
			url := fmt.Sprintf("https://api.twitch.tv/helix/channels/followed?user_id=%s", user_id) 

			if cursor != "" {
				url += "&after=" + cursor
			}

			req, err := http.NewRequest("GET", url, nil)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
				return
			}

			req.Header.Set("Authorization", "Bearer "+twitchToken)
			req.Header.Set("Client-Id", twitchClient)

			client := &http.Client{}
			resp, err := client.Do(req)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Twitch API"})
				return
			}
			defer resp.Body.Close()

			body, err := io.ReadAll(resp.Body)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
				return
			}
			fmt.Println("Raw JSON:", string(body)) // DEBUG LINE

			var twitchResp models.FollowsResponse
			if err := json.Unmarshal(body, &twitchResp); err != nil {
				return
			}

			allFollows = append(allFollows, twitchResp.Data...)

			// Check for next page
			if twitchResp.Pagination.Cursor == "" {
				break 
			}

			cursor = twitchResp.Pagination.Cursor
		}

		c.JSON(200, gin.H{
			"follows": allFollows,
    		"total": len(allFollows),
		})
	}
}