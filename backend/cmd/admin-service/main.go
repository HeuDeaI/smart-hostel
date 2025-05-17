package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	adminapp "github.com/smart-hostel/backend/internal/admin-service/application"
	adminhttp "github.com/smart-hostel/backend/internal/admin-service/transport/http"
	bookingapp "github.com/smart-hostel/backend/internal/booking-service/application"
	bookingrepo "github.com/smart-hostel/backend/internal/booking-service/infrastructure/repository"
	userapp "github.com/smart-hostel/backend/internal/user-service/application"
	userrepo "github.com/smart-hostel/backend/internal/user-service/infrastructure/persistence"
)

func main() {
	dsn := "host=localhost port=5432 user=postgres password=postgres dbname=smart_hotel sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	userRepo := userrepo.NewUserRepository(db)
	bookingRepo := bookingrepo.NewBookingRepository(db)
	roomRepo := bookingrepo.NewRoomRepository(db)

	jwtSecret := "your-secret-key"
	userService := userapp.NewUserService(userRepo, jwtSecret)
	bookingService := bookingapp.NewBookingService(bookingRepo, roomRepo)
	adminService := adminapp.NewAdminService(userService, bookingService, roomRepo)

	router := adminhttp.SetupRouter(adminService, jwtSecret)

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true
	config.ExposeHeaders = []string{"Content-Length"}
	router.Use(cors.New(config))

	log.Printf("Admin service starting on %s", "localhost:8083")
	if err := router.Run("localhost:8083"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
