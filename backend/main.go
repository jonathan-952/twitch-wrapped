package main

import (
	"os"
	"github.com/gin-gonic/gin"
	"github.com/jonathan-952/twitch-wrapped/backend/controllers"
	"github.com/jonathan-952/twitch-wrapped/backend/database"
	"github.com/jonathan-952/twitch-wrapped/backend/models"
	"github.com/jonathan-952/twitch-wrapped/backend/auth"
	"github.com/joho/godotenv"
	"github.com/gin-contrib/cors"
)	

func main() {
	godotenv.Load(".env")

	var (
	// OAUTH_TOKEN = os.Getenv("OAUTH_TOKEN")
	TwitchClient = os.Getenv("CLIENT_ID")
	TwitchSecret = os.Getenv("TWITCH_SECRET")
	DBConnection = os.Getenv("DB_CONNECTION")
	OAuthToken = os.Getenv("OAUTH_TOKEN")
	JWTSecret = os.Getenv("JWT_SECRET")
	
	)

	database.DatabaseConnection(DBConnection)
	// to access gorm obj -> use database.DB

	// auto migrates our user schema to db, doesn't do anything if already migrated
	database.DB.AutoMigrate(&models.User{}, &models.Following{})


	router := gin.Default()

	router.Use(cors.New(*controllers.CorsPolicy()))

	// router.GET("/get_user/:user", controllers.NewGetTwitchUserHandler(OAUTH_TOKEN, TwitchClient))
	router.GET("/following", auth.JWTMiddleware(TwitchSecret, TwitchClient, JWTSecret), controllers.GetFollowedChannels(TwitchClient))
	router.POST("/authenticate_token", auth.Authenticate_Token(TwitchSecret, TwitchClient, OAuthToken, JWTSecret))
	router.GET("/get_clips", auth.JWTMiddleware(TwitchSecret, TwitchClient, JWTSecret), controllers.GetClips(OAuthToken, TwitchClient))

	router.Run()
}
