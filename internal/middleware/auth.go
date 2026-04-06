package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/8w6s/nexusplane/internal/services"
)

// AuthRequired là middleware xác thực JWT cho các API được bảo vệ
func AuthRequired(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{"error": "Yêu cầu đăng nhập để thực hiện"})
	}

	// Format: Bearer <token>
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return c.Status(401).JSON(fiber.Map{"error": "Định dạng token không hợp lệ"})
	}

	tokenString := parts[1]
	claims, err := services.VerifyJWT(tokenString)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Mã truy cập đã hết hạn hoặc không hợp lệ"})
	}

	// Lưu thông tin user vào context để các handler sau sử dụng
	c.Locals("userId", claims.UserID)
	c.Locals("userRole", claims.Role)
	c.Locals("userEmail", claims.Email)

	return c.Next()
}

// AdminOnly chỉ cho phép user có Role admin truy cập
func AdminOnly(c *fiber.Ctx) error {
	role := c.Locals("userRole")
	if role != "admin" {
		return c.Status(403).JSON(fiber.Map{"error": "Bạn không có quyền thực hiện hành động này"})
	}
	return c.Next()
}
