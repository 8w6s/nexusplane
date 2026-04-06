package models

type ShopPlan struct {
	ID           string   `json:"id" gorm:"primaryKey"`
	Name         string   `json:"name"`
	Tier         string   `json:"tier"` 
	CpuCores     int      `json:"cpuCores"`
	RamGb        int      `json:"ramGb"`
	DiskGb       int      `json:"diskGb"`
	BandwidthTb  int      `json:"bandwidthTb"`
	PriceMonthly float64  `json:"priceMonthly"`
	PriceHourly  float64  `json:"priceHourly"`
	Highlights   []string `json:"highlights" gorm:"serializer:json"`
}
