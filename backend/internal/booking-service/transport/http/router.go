package http

import (
	"github.com/gin-gonic/gin"
	"github.com/smart-hostel/backend/internal/booking-service/application"
)

func SetupRouter(bookingService *application.BookingService) *gin.Engine {
	router := gin.Default()

	bookingHandler := NewBookingHandler(bookingService)
	roomHandler := NewRoomHandler(bookingService)

	// Booking routes
	bookings := router.Group("/bookings")
	{
		bookings.POST("", bookingHandler.CreateBooking)
		bookings.GET("/user/:user_id", bookingHandler.GetUserBookings)
		bookings.DELETE("/:id", bookingHandler.CancelBooking)
	}

	// Room routes
	rooms := router.Group("/rooms")
	{
		rooms.POST("/seed", roomHandler.SeedRooms)
		rooms.GET("", roomHandler.GetAllRooms)
		rooms.GET("/:id", roomHandler.GetRoom)
	}

	// Available rooms route
	router.GET("/available-rooms", bookingHandler.GetAvailableRooms)

	return router
}
