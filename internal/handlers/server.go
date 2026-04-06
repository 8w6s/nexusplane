package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"github.com/8w6s/nexusplane/internal/config"
	"github.com/8w6s/nexusplane/internal/models"
)

// GetServers trả về danh sách máy chủ của user
func GetServers(c *fiber.Ctx) error {
	var servers []models.Server
	userID := c.Locals("userId").(string)

	result := config.DB.Where("user_id = ?", userID).Find(&servers)
	
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Không thể lấy danh sách máy chủ",
		})
	}

	return c.JSON(fiber.Map{
		"servers": servers,
	})
}

// CreateServer xử lý request tạo VPS/Server mới
func CreateServer(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	req := new(models.CreateServerRequest)

	if err := c.BodyParser(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Dữ liệu đầu vào không hợp lệ",
		})
	}

	if req.Name == "" || req.Image == "" || req.Plan == "" || req.Region == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Thiếu các thông tin bắt buộc",
		})
	}

	server := models.Server{
		ID:        uuid.New().String(),
		UserID:    userID,
		Name:      req.Name,
		Region:    req.Region,
		Plan:      req.Plan,
		Image:     req.Image,
		Status:    "provisioning",
		IPAddress: "Pending",
		CreatedAt: time.Now(),
	}

	// Lưu xuống DB
	if err := config.DB.Create(&server).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Không thể lưu server vào hệ thống",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Đã tiếp nhận yêu cầu tạo server",
		"server":  server,
	})
}
