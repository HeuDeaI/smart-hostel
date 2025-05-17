package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/smart-hostel/backend/internal/user-service/application"
	"github.com/smart-hostel/backend/internal/user-service/infrastructure/persistence"
	"github.com/smart-hostel/backend/internal/user-service/transport/http"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := "host=localhost port=5432 user=postgres password=postgres dbname=smart_hotel sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := db.AutoMigrate(&persistence.User{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	userRepo := persistence.NewUserRepository(db)
	userService := application.NewUserService(userRepo, "your-secret-key")

	router := http.SetupRouter(userService, "your-secret-key")

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true
	config.ExposeHeaders = []string{"Content-Length"}
	router.Use(cors.New(config))

	log.Printf("Server starting on %s", "10.65.158.20:8081")
	if err := router.Run("10.65.158.20:8081"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
