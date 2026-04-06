package config

import (
	"log"
	"os"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"github.com/8w6s/nexusplane/internal/models"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	
	// Create data directory if not exists
	os.MkdirAll("./data", os.ModePerm)

	DB, err = gorm.Open(sqlite.Open("./data/nexusplane.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database. \n", err)
	}

	log.Println("Database connection successfully opened")

	err = DB.AutoMigrate(
		&models.Server{},
		&models.Node{},
		&models.ShopPlan{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database. \n", err)
	}
	
	log.Println("Database successfully migrated")
}
