package http

import (
	"github.com/gin-gonic/gin"
	"github.com/smart-hostel/backend/internal/booking-service/domain"
)

func SetupRouter(bookingService domain.BookingService) *gin.Engine {
	router := gin.Default()

	bookingHandler := NewBookingHandler(bookingService)
	roomHandler := NewRoomHandler(bookingService)

	bookings := router.Group("/bookings")
	{
		bookings.POST("", bookingHandler.CreateBooking)
		bookings.GET("/user/:user_id", bookingHandler.GetUserBookings)
		bookings.DELETE("/:id", bookingHandler.CancelBooking)
	}

	rooms := router.Group("/rooms")
	{
		rooms.POST("/seed", roomHandler.SeedRooms)
		rooms.GET("", roomHandler.GetAllRooms)
		rooms.GET("/:id", roomHandler.GetRoom)
	}

	router.GET("/available-rooms", bookingHandler.GetAvailableRooms)

	return router
}
