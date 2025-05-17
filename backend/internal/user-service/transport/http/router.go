package http

import (
	"github.com/gin-gonic/gin"
	"github.com/smart-hostel/backend/internal/platform/auth"
	"github.com/smart-hostel/backend/internal/user-service/domain"
)

func SetupRouter(userService domain.UserService, jwtSecret string) *gin.Engine {
	router := gin.Default()
	handler := NewUserHandler(userService)

	router.POST("/register", handler.Register)
	router.POST("/login", handler.Login)

	authorized := router.Group("/")
	authorized.Use(auth.JWTMiddleware(jwtSecret))
	{
		authorized.GET("/users/:id", handler.GetUserByID)
		authorized.PUT("/users/:id", handler.UpdateUser)
		authorized.DELETE("/users/:id", handler.DeleteUser)

		admin := authorized.Group("/")
		admin.Use(auth.RequireRole("admin"))
		{
			admin.GET("/users", handler.GetAllUsers)
		}
	}

	return router
}
