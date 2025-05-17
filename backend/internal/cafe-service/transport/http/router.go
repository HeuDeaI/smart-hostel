package http

import (
	"github.com/gin-gonic/gin"
	"github.com/smart-hostel/backend/internal/cafe-service/domain"
	"github.com/smart-hostel/backend/internal/platform/auth"
)

func SetupRouter(cafeService domain.CafeService, jwtSecret string) *gin.Engine {
	router := gin.Default()
	handler := NewCafeHandler(cafeService)

	menu := router.Group("/menu")
	{
		menu.GET("", handler.GetAllMenuItems)
		menu.GET("/category", handler.GetMenuItemsByCategory)
		menu.GET("/:id", handler.GetMenuItem)
	}

	protected := router.Group("")
	protected.Use(auth.JWTMiddleware(jwtSecret))
	{
		admin := protected.Group("")
		admin.Use(auth.RequireRole("admin"))
		{
			admin.POST("/menu/seed", handler.SeedMenuItems)
		}

		orders := protected.Group("/orders")
		{
			orders.POST("", handler.CreateOrder)
			orders.GET("/:id", handler.GetOrder)
			orders.GET("/user/:user_id", handler.GetUserOrders)
			orders.PUT("/:id/status", handler.UpdateOrderStatus)
		}
	}

	return router
}
