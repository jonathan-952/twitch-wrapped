package main

import (
	"os"
	"github.com/gin-gonic/gin"
	"github.com/jonathan-952/twitch-wrapped/backend/controllers"
	"github.com/jonathan-952/twitch-wrapped/backend/database"
	"github.com/joho/godotenv"
	"github.com/gin-contrib/cors"
	"time"
)

func main() {
	godotenv.Load(".env")

	var (
	OAUTH_TOKEN = os.Getenv("OAUTH_TOKEN")
	TwitchClient = os.Getenv("CLIENT_ID")
	TwitchSecret = os.Getenv("TWITCH_SECRET")
	UserAuth = os.Getenv("USER_AUTH")
	DBConnection = os.Getenv("DB_CONNECTION")
	)

	database.DatabaseConnection(DBConnection)
	// to access gorm obj -> use database.DB


	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"} // Replace with your frontend origin(s)
	// config.AllowAllOrigins = true // Alternatively, allow all origins (less secure for production)
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization", "Accept", "User-Agent", "Cache-Control", "Pragma"}
	config.ExposeHeaders = []string{"Content-Length"}
	config.AllowCredentials = true
	config.MaxAge = 12 * time.Hour // Cache preflight requests for 12 hours

	router.Use(cors.New(config))

	router.GET("/get_user/:user", controllers.NewGetTwitchUserHandler(OAUTH_TOKEN, TwitchClient))
	router.GET("/:user/following", controllers.GetFollowedChannels(UserAuth, TwitchClient))
	router.POST("/authenticate_token", controllers.Authenticate_Token(TwitchSecret, TwitchClient))

	router.Run()
}
