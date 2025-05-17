package http

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
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

	server.router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},                                       // Allows all origins
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, // Include OPTIONS for preflight requests
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: false, // Set to false if credentials aren't required
		MaxAge:           12 * time.Hour,
	}))

	userHandler := NewUserHandler(userService)

	server.router.POST("/users", userHandler.CreateUser)
	server.router.GET("/users/:id", userHandler.GetUserByID)
	server.router.PUT("/users/:id", userHandler.UpdateUser)
	server.router.DELETE("/users/:id", userHandler.DeleteUser)
	server.router.GET("/users", userHandler.GetAllUsers)
	server.router.POST("/login", userHandler.Login)
	server.router.GET("/ws", userHandler.HandleWebSocket)

	return server
}

func (s *HTTPServer) Start(port string) error {
	s.router.Run("10.65.158.93:8080")
	return s.router.Run(":" + port)
}
