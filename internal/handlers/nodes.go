package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/8w6s/nexusplane/internal/config"
	"github.com/8w6s/nexusplane/internal/models"
)

// GetNodes trả về tất cả các physical node trong fleet
func GetNodes(c *fiber.Ctx) error {
	var nodes []models.Node

	result := config.DB.Find(&nodes)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Lỗi truy xuất hệ thống Nodes",
		})
	}

	return c.JSON(fiber.Map{
		"nodes": nodes,
	})
}
