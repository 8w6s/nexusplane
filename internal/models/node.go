package models

import "time"

type Node struct {
	ID            string    `json:"id" gorm:"primaryKey"`
	Name          string    `json:"name"`
	Provider      string    `json:"provider"`
	RegionId      string    `json:"regionId"`
	IP            string    `json:"ip"`
	Status        string    `json:"status"` // "active", "maintenance", "offline"
	HardwareId    string    `json:"hardwareId"`
	OS            string    `json:"os"`
	InstanceCount int       `json:"instanceCount"`
	CpuUsage      int       `json:"cpuUsage"`
	RamUsage      int       `json:"ramUsage"`
	DiskUsage     int       `json:"diskUsage"`
	Tags          []string  `json:"tags" gorm:"serializer:json"` 
	CreatedAt     time.Time `json:"createdAt"`
}
