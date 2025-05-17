package http

import (
	"github.com/gin-gonic/gin"
	"github.com/smart-hostel/backend/internal/cafe-service/domain"
)

func SetupRouter(cafeService domain.CafeService) *gin.Engine {
	router := gin.Default()
	handler := NewCafeHandler(cafeService)

	menu := router.Group("/menu")
	{
		menu.POST("/seed", handler.SeedMenuItems)
		menu.GET("", handler.GetAllMenuItems)
		menu.GET("/category", handler.GetMenuItemsByCategory)
		menu.GET("/:id", handler.GetMenuItem)
	}

	orders := router.Group("/orders")
	{
		orders.POST("", handler.CreateOrder)
		orders.GET("/:id", handler.GetOrder)
		orders.GET("/user/:user_id", handler.GetUserOrders)
		orders.PUT("/:id/status", handler.UpdateOrderStatus)
	}

	return router
}
