package controllers

import (
	"github.com/gin-contrib/cors"
	"time"
)

func CorsPolicy() *cors.Config {
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"https://www.twitch-wrapped-puytnxzg2-jonathan-952s-projects.vercel.app"} // Replace with your frontend origin(s)
	// config.AllowAllOrigins = true // Alternatively, allow all origins (less secure for production)
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization", "Accept", "User-Agent", "Cache-Control", "Pragma"}
	config.ExposeHeaders = []string{"Content-Length"}
	config.AllowCredentials = true
	config.MaxAge = 12 * time.Hour // Cache preflight requests for 12 hours

	return &config
}