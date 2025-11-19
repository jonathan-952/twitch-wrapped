package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"fmt"
	"log"
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
