package models

import (
	"gorm.io/gorm"
	"time"
)

type Clip struct {
	ClipID string `json:"id"`
	URL string `json:"url"`
	Title string `json:"title"`
	ViewCount int `json:"view_count"`
	CreatedAt string `json:"created_at"`
	Duration float64 `json:"duration"`
	ThumbnailURL string `json:"thumbnail_url"`
	EmbedURL string `json:"embed_url"`
}

type ClipParams struct {
	StartedAt string `json:"started"`
	EndedAt string `json:"ended"`
}

type TwitchClipsResponse struct {
    Data       []Clip       `json:"data"`
    Pagination Pagination   `json:"pagination"`
}

type ClipSnapshot struct {
	gorm.Model
	ClipID string
	CreatedAt string
	LastChecked time.Time
	LastViewCount int
}