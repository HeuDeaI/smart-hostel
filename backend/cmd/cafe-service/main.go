package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/smart-hostel/backend/internal/cafe-service/application"
	"github.com/smart-hostel/backend/internal/cafe-service/infrastructure/persistence"
	"github.com/smart-hostel/backend/internal/cafe-service/infrastructure/repository"
	"github.com/smart-hostel/backend/internal/cafe-service/transport/http"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := "host=localhost port=5432 user=postgres password=postgres dbname=smart_hotel sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := db.AutoMigrate(&persistence.MenuItem{}, &persistence.Order{}, &persistence.OrderItem{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	menuRepo := repository.NewMenuRepository(db)
	orderRepo := repository.NewOrderRepository(db)

	cafeService := application.NewCafeService(menuRepo, orderRepo)

	router := http.SetupRouter(cafeService, "your-secret-key")

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true
	config.ExposeHeaders = []string{"Content-Length"}
	router.Use(cors.New(config))

	log.Printf("Cafe service starting on %s", "localhost:8083")
	if err := router.Run("localhost:8083"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
