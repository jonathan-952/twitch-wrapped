package models

type FollowData struct {
	BroadcasterID    string `json:"broadcaster_id"`
	BroadcasterLogin string `json:"broadcaster_login"`
	BroadcasterName  string `json:"broadcaster_name"`
	FollowedAt       string `json:"followed_at"`
}

type Pagination struct {
	Cursor string `json:"cursor"`
}

type FollowsResponse struct {
	UserID	   int
	Total      int          `json:"total"`
	Data       []FollowData `json:"data"`
	Pagination Pagination   `json:"pagination"`
}