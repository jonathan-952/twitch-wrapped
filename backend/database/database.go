package database

import (
	"fmt"
	"log"
	"time"

	"github.com/jonathan-952/twitch-wrapped/backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func DatabaseConnection(db_connection string) {
	db, err := gorm.Open(postgres.Open(db_connection), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info), // Set to Info level for development
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	// Get the underlying SQL DB object
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get DB object: %v", err)
	}
	// Verify connection
	if err := sqlDB.Ping(); err != nil {
		log.Fatalf("Failed to ping DB: %v", err)
	}

	DB = db
	fmt.Println("Successfully connected to Neon Postgres database!")
}

func CreateUser(user_id, auth_token, refresh_token string, expires_at int) *gorm.DB {
	user := models.User{
		UserID: user_id,
		Token: auth_token,
		RefreshToken: refresh_token,
		ExpiresAt: expires_at,
	}

	add := DB.Create(&user)

	return add

}

func UpdateUser(id uint, auth_token, refresh_token string, expires_at int) error {
	// Update multiple fields at once
	result := DB.Model(&models.User{}).Where("id = ?", id).Updates(models.User{
	Token:	auth_token,
	RefreshToken: refresh_token,
	ExpiresAt: expires_at,
	})
	return result.Error
}

func CreateSnapshot(clip_id, created_at string, last_checked time.Time, last_view_count int) error {
	snapshot := models.ClipSnapshot{
		ClipID: clip_id,
		CreatedAt: created_at,
		LastChecked: last_checked,
		LastViewCount: last_view_count,
	}

	add := DB.Create(&snapshot)

	return add.Error
}

func UpdateClipSnapshot() {

}
