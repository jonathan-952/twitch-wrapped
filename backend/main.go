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
	UserAuth = os.Getenv("USER_AUTH")
	DBConnection = os.Getenv("DB_CONNECTION")
	OAuthToken = os.Getenv("OAUTH_TOKEN")
	JWTSecret = os.Getenv("JWT_SECRET")

	)

	database.DatabaseConnection(DBConnection)
	// to access gorm obj -> use database.DB

	// auto migrates our user schema to db, doesn't do anything if already migrated
	database.DB.AutoMigrate(&models.User{})


	router := gin.Default()

	router.Use(cors.New(*controllers.CorsPolicy()))

	// router.GET("/get_user/:user", controllers.NewGetTwitchUserHandler(OAUTH_TOKEN, TwitchClient))
	router.GET("/:user/following", controllers.GetFollowedChannels(UserAuth, TwitchClient))
	router.POST("/authenticate_token", auth.Authenticate_Token(TwitchSecret, TwitchClient, OAuthToken, JWTSecret))

	router.Run()
}

// auth workflow:
// 	get user_id
// 	pass into Oauth
//  get tokens -> store in db
// 	cookies next?
