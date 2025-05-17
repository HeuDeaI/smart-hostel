package http

import (
	"github.com/gin-gonic/gin"
	"github.com/smart-hostel/backend/internal/booking-service/domain"
	"github.com/smart-hostel/backend/internal/platform/auth"
)

func SetupRouter(bookingService domain.BookingService, jwtSecret string) *gin.Engine {
	router := gin.Default()

	bookingHandler := NewBookingHandler(bookingService)
	roomHandler := NewRoomHandler(bookingService)

	router.GET("/available-rooms", bookingHandler.GetAvailableRooms)

	protected := router.Group("")
	protected.Use(auth.JWTMiddleware(jwtSecret))
	{
		admin := protected.Group("")
		admin.Use(auth.RequireRole("admin"))
		{
			admin.POST("/rooms/seed", roomHandler.SeedRooms)
		}

		bookings := protected.Group("/bookings")
		{
			bookings.POST("", bookingHandler.CreateBooking)
			bookings.GET("/user/:user_id", bookingHandler.GetUserBookings)
			bookings.DELETE("/:id", bookingHandler.CancelBooking)
		}

		rooms := protected.Group("/rooms")
		{
			rooms.GET("", roomHandler.GetAllRooms)
			rooms.GET("/:id", roomHandler.GetRoom)
		}
	}

	return router
}
