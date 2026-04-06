package config

import (
	"log"

	"github.com/8w6s/nexusplane/internal/models"
	"github.com/8w6s/nexusplane/internal/services"
)

// SeedDatabase bơm dữ liệu mẫu tối thiểu cho các model Catalog và Node
// để Frontend có thể hiển thị được thông tin lúc ban đầu.
func SeedDatabase() {
	var count int64
	
	// Seed Users
	DB.Model(&models.User{}).Count(&count)
	if count == 0 {
		hashedPw, _ := services.HashPassword("admin123")
		admin := models.User{
			ID:           "admin_nexus_01",
			Email:        "admin@nexusplane.io",
			PasswordHash: hashedPw,
			Name:         "Platform Admin",
			Role:         "admin",
		}
		DB.Create(&admin)
		log.Println("Seeder: Đã tạo User Admin mặc định (admin@nexusplane.io / admin123)")
	}

	// Seed Plans
	DB.Model(&models.ShopPlan{}).Count(&count)
	if count == 0 {
		plans := []models.ShopPlan{
			{
				ID:           "plan_starter_01",
				Name:         "Starter Compute",
				Tier:         "Standard",
				CpuCores:     1,
				RamGb:        1,
				DiskGb:       25,
				BandwidthTb:  1,
				PriceMonthly: 4.99,
				PriceHourly:  0.007,
				Highlights:   []string{"1 vCPU", "1 GB RAM", "25 GB NVMe", "1 TB Bandwidth"},
			},
			{
				ID:           "plan_pro_01",
				Name:         "Pro Compute",
				Tier:         "Premium",
				CpuCores:     2,
				RamGb:        4,
				DiskGb:       80,
				BandwidthTb:  3,
				PriceMonthly: 19.99,
				PriceHourly:  0.027,
				Highlights:   []string{"2 vCPU", "4 GB RAM", "80 GB NVMe", "3 TB Bandwidth"},
			},
            {
				ID:           "plan_max_01",
				Name:         "Ultra Performance",
				Tier:         "Ultra",
				CpuCores:     8,
				RamGb:        16,
				DiskGb:       320,
				BandwidthTb:  10,
				PriceMonthly: 79.99,
				PriceHourly:  0.109,
				Highlights:   []string{"8 Dedicated vCPU", "16 GB RAM", "320 GB NVMe", "Unmetered"},
			},
		}

		if err := DB.Create(&plans).Error; err != nil {
			log.Println("Seeder Lỗi khi Seed Plans:", err)
		} else {
			log.Println("Seeder: Bơm thành công các gói ShopPlan")
		}
	}

	// Seed Nodes
	DB.Model(&models.Node{}).Count(&count)
	if count == 0 {
		nodes := []models.Node{
			{
				ID:            "node_us_east_1",
				Name:          "nyc-hx-01",
				Provider:      "Hetzner",
				RegionId:      "us-east",
				IP:            "192.168.1.100",
				Status:        "active",
				HardwareId:    "sys-7019-rx1",
				OS:            "Ubuntu 22.04 LTS (Hypervisor)",
				InstanceCount: 0,
				CpuUsage:      15,
				RamUsage:      22,
				DiskUsage:     5,
				Tags:          []string{"ssd", "10gbe", "compute-optimized"},
			},
		}
		if err := DB.Create(&nodes).Error; err != nil {
			log.Println("Seeder Lỗi khi Seed Nodes:", err)
		} else {
			log.Println("Seeder: Bơm thành công các máy chủ gốc (Nodes)")
		}
	}
}
