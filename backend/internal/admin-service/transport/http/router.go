package http

import (
	"github.com/gin-gonic/gin"
	"github.com/smart-hostel/backend/internal/admin-service/domain"
	// "github.com/smart-hostel/backend/internal/platform/auth"
)

func SetupRouter(adminService domain.AdminService, jwtSecret string) *gin.Engine {
	router := gin.Default()
	handler := NewHandler(adminService)

	admin := router.Group("/admin")
	// admin.Use(auth.JWTMiddleware(jwtSecret))
	// admin.Use(auth.RequireRole("admin"))
	{
		admin.GET("/dashboard", handler.GetDashboard)
		admin.GET("/stats", handler.GetStats)

		admin.GET("/users", handler.GetAllUsers)
		admin.PUT("/users/:id/role", handler.UpdateUserRole)
		admin.DELETE("/users/:id", handler.DeleteUser)

		admin.GET("/bookings", handler.GetAllBookings)
		admin.DELETE("/bookings/:id", handler.DeleteBooking)

		admin.GET("/rooms", handler.GetAllRooms)
	}

	return router
}
