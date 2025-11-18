package main

import (
	"os"
	"github.com/gin-gonic/gin"
	"github.com/jonathan-952/twitch-wrapped/backend/controllers"
	// "fmt"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load(".env")

	var (
	OAUTH_TOKEN = os.Getenv("OAUTH_TOKEN")
	TwitchClient = os.Getenv("CLIENT_ID")
	)

	router := gin.Default()

	router.GET("/get_user/:user", controllers.NewGetTwitchUserHandler(OAUTH_TOKEN, TwitchClient))
	router.GET("/:user/following", controllers.GetFollowedChannels(OAUTH_TOKEN, TwitchClient))

	router.Run()
}


// backend workflow: