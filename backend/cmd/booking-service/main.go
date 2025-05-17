package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/smart-hostel/backend/internal/booking-service/application"
	"github.com/smart-hostel/backend/internal/booking-service/domain"
	"github.com/smart-hostel/backend/internal/booking-service/infrastructure/repository"
	"github.com/smart-hostel/backend/internal/booking-service/transport/http"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := "host=localhost port=5432 user=postgres password=postgres dbname=smart_hotel sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := db.AutoMigrate(&domain.Booking{}, &domain.Room{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	bookingRepo := repository.NewBookingRepository(db)
	roomRepo := repository.NewRoomRepository(db)

	bookingService := application.NewBookingService(bookingRepo, roomRepo)

	router := http.SetupRouter(bookingService)

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true
	config.ExposeHeaders = []string{"Content-Length"}
	router.Use(cors.New(config))

	log.Printf("Booking service starting on %s", "10.65.158.20:8081")
	if err := router.Run("10.65.158.20:8081"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
