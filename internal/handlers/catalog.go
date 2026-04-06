package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/8w6s/nexusplane/internal/config"
	"github.com/8w6s/nexusplane/internal/models"
)

// GetPlans trả về tất cả các danh mục máy chủ 
func GetPlans(c *fiber.Ctx) error {
	var plans []models.ShopPlan

	result := config.DB.Find(&plans)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Lỗi truy xuất hệ thống plans",
		})
	}

	return c.JSON(fiber.Map{
		"plans": plans,
	})
}
