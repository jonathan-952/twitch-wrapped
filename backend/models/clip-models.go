package models

type Clip struct {
	URL string `json:"url"`
	Title string `json:"title"`
	ViewCount int `json:"view_count"`
	CreatedAt string `json:"created_at"`
}

type ClipParams struct {
	StartedAt string 
	EndedAt string 
	First int 
}

type TwitchClipsResponse struct {
    Data       []Clip       `json:"data"`
    Pagination Pagination   `json:"pagination"`
}