package models

import (
	"time"
)

type Server struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId"`
	Name      string    `json:"name"`
	Region    string    `json:"region"`
	Plan      string    `json:"plan"`
	Image     string    `json:"image"`
	Status    string    `json:"status"` // provisioning, running, stopped, degraded, deleted
	IPAddress string    `json:"ipAddress"`
	CreatedAt time.Time `json:"createdAt"`
}

type CreateServerRequest struct {
	Name   string `json:"name"`
	Region string `json:"region"`
	Plan   string `json:"plan"`
	Image  string `json:"image"`
}
