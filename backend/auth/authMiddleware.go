package auth

import (
	"net/http"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jonathan-952/twitch-wrapped/backend/database"
	"github.com/jonathan-952/twitch-wrapped/backend/models"
)

func GenerateJWT(id uint, expiration int, JWT_Secret string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		// fetch both of these from user model in db
		"id": id,
		"expires_at": expiration,
	})

	// Sign and get the complete encoded token as a string using the secret
	return token.SignedString([]byte(JWT_Secret))
}

func JWTMiddleware(TwitchSecret, TwitchClient, JWT_Secret string) gin.HandlerFunc {
	return func (c *gin.Context) {
		tokenStr, err := c.Cookie("twitch_auth")

		if err != nil {
			c.AbortWithStatus(http.StatusUnauthorized)
		}

		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (any, error) {
		// how does a callback work here?
			return []byte(JWT_Secret), nil
			}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))
			if err != nil {
				c.AbortWithStatus(http.StatusUnauthorized)
				log.Fatal(err)
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if !ok {
				c.AbortWithStatus(http.StatusUnauthorized)
			}
			if float64(time.Now().Unix()) > claims["expires_at"].(float64) {
				var user models.User
				fetched_user := database.DB.First(&user, claims["id"])

				if fetched_user.Error != nil {
					c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
					return
				}
				// refresh token if expired
				resp, err := RefreshToken(TwitchSecret, TwitchClient, user.RefreshToken)
				
				if err != nil {

				}

				update_user := database.UpdateUser(uint(claims["id"].(float64)), resp.Token, resp.RefreshToken, resp.ExpiresAt)
				
				if update_user != nil {
					c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "error updating user tokens in database"})
				}
			}

			var retrievedUser models.User
		
			result := database.DB.Where("ID = ?", claims["id"]).First(&retrievedUser)
			if result.Error != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to retreive user"})
			}
			c.Set("twitch_user_id", retrievedUser.UserID)
			c.Set("OAuth_Token", retrievedUser.Token)

			c.Next()
		} else {
			c.AbortWithStatus(http.StatusUnauthorized)
		}
	}
}