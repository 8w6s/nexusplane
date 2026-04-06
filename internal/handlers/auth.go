package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/8w6s/nexusplane/internal/config"
	"github.com/8w6s/nexusplane/internal/models"
	"github.com/8w6s/nexusplane/internal/services"
)

// Register xử lý đăng ký tài khoản mới
func Register(c *fiber.Ctx) error {
	req := new(models.RegisterRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Dữ liệu không hợp lệ"})
	}

	// Kiểm tra Email tồn tại
	var existing models.User
	if config.DB.Where("email = ?", req.Email).First(&existing).RowsAffected > 0 {
		return c.Status(400).JSON(fiber.Map{"error": "Email đã được sử dụng"})
	}

	hashedPassword, err := services.HashPassword(req.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Lỗi xử lý bảo mật"})
	}

	user := models.User{
		ID:           uuid.New().String(),
		Email:        req.Email,
		PasswordHash: hashedPassword,
		Name:         req.Name,
		Role:         "tenant", // Mặc định là tenant
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := config.DB.Create(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Không thể tạo tài khoản"})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Đăng ký thành công", "user": user})
}

// Login xử lý đăng nhập và trả về JWT
func Login(c *fiber.Ctx) error {
	req := new(models.LoginRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Dữ liệu không hợp lệ"})
	}

	var user models.User
	if err := config.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Email hoặc mật khẩu không đúng"})
	}

	if !services.CheckPasswordHash(req.Password, user.PasswordHash) {
		return c.Status(401).JSON(fiber.Map{"error": "Email hoặc mật khẩu không đúng"})
	}

	token, err := services.GenerateJWT(user.ID, user.Email, user.Role)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Không thể tạo mã truy cập"})
	}

	return c.JSON(models.AuthResponse{
		Token: token,
		User:  user,
	})
}
