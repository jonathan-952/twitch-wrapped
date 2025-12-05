package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"github.com/gin-gonic/gin"
	// "github.com/jonathan-952/twitch-wrapped/backend/database"
	"github.com/jonathan-952/twitch-wrapped/backend/models"
)

type TwitchUser struct {
	ID string `json:"id"`
}

type TwitchResponse struct {
	Data []TwitchUser `json:"data"`
}


func GetTwitchUserID(OAuthToken, twitchClient, user string) (string, error) {

		url := fmt.Sprintf("https://api.twitch.tv/helix/users?login=%s", user)

		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return "", err
		}

		req.Header.Set("Authorization", "Bearer "+OAuthToken)
		req.Header.Set("Client-Id", twitchClient)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return "", err
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return "", err
		}

		var result TwitchResponse
		if err := json.Unmarshal(body, &result); err != nil {
			return "", err
		}

		if len(result.Data) == 0 {
        	return "", fmt.Errorf("no user data found")
    	}
		fmt.Println(result.Data[0].ID)

		return result.Data[0].ID, nil
}


func GetFollowedChannels(twitchClient string) gin.HandlerFunc {
	return func(c *gin.Context) {
		allFollows := []models.FollowData{}
		// var following []models.Following
		cursor := ""
		twitch_user_id := c.GetString("twitch_user_id")
		OAuth_Token := c.GetString("OAuth_Token")
		// user_id := c.GetUint("user_id")

		for {
			url := fmt.Sprintf("https://api.twitch.tv/helix/channels/followed?user_id=%s", twitch_user_id) 

			if cursor != "" {
				url += "&after=" + cursor
			}

			req, err := http.NewRequest("GET", url, nil)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
				return
			}

			req.Header.Set("Authorization", "Bearer "+OAuth_Token)
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

			var twitchResp models.FollowsResponse
			if err := json.Unmarshal(body, &twitchResp); err != nil {
				return
			}

			allFollows = append(allFollows, twitchResp.Data...)
			
			// for _, f := range twitchResp.Data {
			// 	following = append(following, models.Following{
			// 	FollowerID:      uint(user_id),
			// 	BroadcasterID:   f.BroadcasterID,
			// 	BroadcasterName: f.BroadcasterName,
        	// 	})
    		// }
			// Check for next page
			if twitchResp.Pagination.Cursor == "" {
				break 
			}

			cursor = twitchResp.Pagination.Cursor
		}
		// fmt.Println(twitch_user_id)
		// // database.DB.Create(&following)
		// self, err := GetTwitchUserID(OAuth_Token, twitchClient, twitch_user_id)
		
		// if err != nil {
		// 	log.Println("error fetching user id: ", err)
		// 	return
		// }
		// fmt.Println(allFollows)

		c.JSON(200, gin.H{
			"follows": allFollows,
    		"total": len(allFollows),
			"self": twitch_user_id,
		})
	}
}