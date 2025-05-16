package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"user-service/internal/models"
)

func InitDB() (*gorm.DB, error) {
	dsn := "host=localhost user=postgres password=postgres dbname=smart_hotel port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	db.AutoMigrate(&models.User{})

	return db, nil
}
