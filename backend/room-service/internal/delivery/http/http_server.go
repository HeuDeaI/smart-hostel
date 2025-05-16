package http

import (
	"github.com/gin-gonic/gin"
	"room-service/internal/services"
)

type HTTPServer struct {
	roomService services.RoomService
	router      *gin.Engine
}

func NewHTTPServer(roomService services.RoomService) *HTTPServer {
	server := &HTTPServer{
		roomService: roomService,
		router:      gin.Default(),
	}

	roomHandler := NewRoomHandler(roomService)

	authGroup := server.router.Group("/")
	authGroup.Use(JWTMiddleware())
	authGroup.POST("/rooms/book", roomHandler.BookRoom)
	authGroup.POST("/rooms/release", roomHandler.ReleaseRoom)

	server.router.GET("/rooms", roomHandler.GetRooms)
	server.router.GET("/ws", roomHandler.HandleWebSocket)

	return server
}

func (s *HTTPServer) Start(port string) error {
	return s.router.Run(":" + port)
}
