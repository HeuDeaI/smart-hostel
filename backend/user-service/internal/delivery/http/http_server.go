package http

import (
	"github.com/gin-gonic/gin"
	"user-service/internal/services"
)

type HTTPServer struct {
	userService services.UserService
	router      *gin.Engine
}

func NewHTTPServer(userService services.UserService) *HTTPServer {
	server := &HTTPServer{
		userService: userService,
		router:      gin.Default(),
	}

	userHandler := NewUserHandler(userService)

	server.router.POST("/users", userHandler.CreateUser)
	server.router.GET("/users/:id", userHandler.GetUserByID)
	server.router.PUT("/users/:id", userHandler.UpdateUser)
	server.router.DELETE("/users/:id", userHandler.DeleteUser)
	server.router.GET("/ws", userHandler.HandleWebSocket)

	return server
}

func (s *HTTPServer) Start(port string) error {
	return s.router.Run(":" + port)
}
