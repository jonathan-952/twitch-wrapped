package controllers

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/jonathan-952/twitch-wrapped/backend/database"
	"github.com/jonathan-952/twitch-wrapped/backend/models"
	"io"
	"net/http"
	"net/url"
	"time"
)

type ClipRequest struct {
	BroadcasterID string `json:"broadcaster_id"`
	// Popularity int
}

func GetClips(OAuthToken, TwitchClient string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// broadcaster_id := c.Query("broadcaster_id")
	
		date_filter := c.Query("date_filter")
		cursor := ""

		allClips := []models.Clip{}
		seen_map := make(map[string]models.ClipSnapshot)
		var addClips []models.ClipSnapshot
		var toUpdate []models.ClipSnapshot

		query := url.Values{}

		switch date_filter {
		case "24hr":
			query.Set("started_at", time.Now().AddDate(0, 0, -1).Format(time.RFC3339))
			query.Set("ended_at", time.Now().Format(time.RFC3339))
		case "weekly":
			query.Set("started_at", time.Now().AddDate(0, 0, -7).Format(time.RFC3339))
			query.Set("ended_at", time.Now().Format(time.RFC3339))
		case "monthly":
			query.Set("started_at", time.Now().AddDate(0, -1, 0).Format(time.RFC3339))
			query.Set("ended_at", time.Now().Format(time.RFC3339))
		case "6 months":
			query.Set("started_at", time.Now().AddDate(0, -6, 0).Format(time.RFC3339))
			query.Set("ended_at", time.Now().Format(time.RFC3339))
		case "yearly":
			query.Set("started_at", time.Now().AddDate(-1, 0, 0).Format(time.RFC3339))
			query.Set("ended_at", time.Now().Format(time.RFC3339))
		} 

		// xqc id, change back later
		query.Set("broadcaster_id", "71092938")
		query.Set("first", "100")

		for {
			url := "https://api.twitch.tv/helix/clips"

			if cursor != "" {
				url += "&after=" + cursor
			}

			url += "?"

			req, err := http.NewRequest("GET", url+query.Encode(), nil)

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
			// map body to variable
			var twitchResp models.TwitchClipsResponse
			if err := json.Unmarshal(body, &twitchResp); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
				return
			}

			clipIDs := make([]string, 0, len(twitchResp.Data))
			for _, c := range twitchResp.Data {
				clipIDs = append(clipIDs, c.ClipID)
			}

			// list of clips we have already stored in db
			var seenClips []models.ClipSnapshot

			if err := database.DB.Where("clip_id IN ?", clipIDs).Find(&seenClips).Error; err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}

			// turn seen clips into map
			for _, c := range seenClips {
				seen_map[c.ClipID] = models.ClipSnapshot{
					CreatedAt:     c.CreatedAt,
					LastChecked:   c.LastChecked,
					LastViewCount: c.LastViewCount,
				}
			}

			// if clip has been seen already, after updating trend score and retention, update last_view count and last_checked time to current
			// replace certain fields in clips in payload with old data (lastChecked, initial view count, etc.)

			allClips = append(allClips, twitchResp.Data...)



			if twitchResp.Pagination.Cursor == "" {
				break
			}

			cursor = twitchResp.Pagination.Cursor
		}
		// check if 12hr difference has passed
		// check for 
		for _, c := range allClips {
			value, ok := seen_map[c.ClipID]
			if ok  && time.Since(value.LastChecked).Hours() >= 12 {
				c.TrendingScore = int(float64(c.ViewCount - value.LastViewCount) / time.Since(value.LastChecked).Hours())
				if c.TrendingScore > 10 {
					c.Retention = "growing"
				} else if c.TrendingScore > 0 {
					c.Retention = "steady"
				} else if c.TrendingScore <= 0 {
					c.Retention = "stagnant"
				}

				toUpdate = append(toUpdate, models.ClipSnapshot{
				ClipID:        c.ClipID,
				LastChecked:   time.Now(),
				LastViewCount: c.ViewCount,
				})

			} else if !ok {
				addClips = append(addClips, models.ClipSnapshot{
					ClipID:        c.ClipID,
					CreatedAt:     c.CreatedAt,
					LastChecked:   time.Now(),
					LastViewCount: c.ViewCount,
				})
			}
		}

		database.DB.Create(&addClips)
		database.UpdateClipSnapshot(toUpdate)

		c.JSON(200, gin.H{
			"clips": allClips,
		})
	}
}
