package controllers

import (
	"io"
	"net/http"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/jonathan-952/twitch-wrapped/backend/models"
	"net/url"
)

type ClipRequest struct {
	BroadcasterID string `json:"broadcaster_id"`
	// Popularity int 
}

func GetClips(OAuthToken, TwitchClient string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// broadcaster_id := c.Query("broadcaster_id")
		started_at := c.Query("started")
		ended_at := c.Query("ended")
		cursor := ""
		allClips := []models.Clip{}

		// params should be passed in from fe and extracted


		query := url.Values{}
		if started_at!= "" {
			query.Set("started_at", started_at)
		}
		if ended_at != "" {
			query.Set("ended_at", ended_at)
		}

		query.Set("broadcaster_id", "71092938")
		query.Set("first", "100")

		for {
			url := "https://api.twitch.tv/helix/clips"

			if cursor != "" {
				url += "&after=" + cursor
			}

			url += "?"

			req, err := http.NewRequest("GET", url + query.Encode(), nil)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
				return
			}

			req.Header.Set("Authorization", "Bearer "+OAuthToken)
			req.Header.Set("Client-Id", TwitchClient)

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

			var twitchResp models.TwitchClipsResponse
			if err := json.Unmarshal(body, &twitchResp); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
				return
			}

			allClips = append(allClips, twitchResp.Data...)

			if twitchResp.Pagination.Cursor == "" {
				break
			}

			cursor = twitchResp.Pagination.Cursor
		}

		c.JSON(200, gin.H{
		"clips": allClips,
	})

		// take into account how many clips you want to fetch
		// query for time window (started/ended date)

}
}

func ClipVelocity() {

}