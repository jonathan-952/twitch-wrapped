package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Token string `json:"access_token"` 
	RefreshToken string `json:"refresh_token"` 
	UserID string
	ExpiresAt int `json:"expires_in"` 
}

type TokenResponse struct {
	Token string `json:"access_token"` 
	RefreshToken string `json:"refresh_token"` 
	UserID string
	ExpiresAt int `json:"expires_in"` 
}