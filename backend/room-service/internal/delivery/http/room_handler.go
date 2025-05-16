package http

import (
	"net/http"
	"strconv"
	"sync"

	"room-service/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type RoomHandler struct {
	Service     services.RoomService
	clients     map[*websocket.Conn]bool
	clientMutex sync.Mutex
}

func NewRoomHandler(service services.RoomService) *RoomHandler {
	handler := &RoomHandler{
		Service: service,
		clients: make(map[*websocket.Conn]bool),
	}

	return handler
}

func (h *RoomHandler) GetRooms(c *gin.Context) {
	availableStr := c.Query("available")
	onlyAvailable := false

	if availableStr != "" {
		if val, err := strconv.ParseBool(availableStr); err == nil {
			onlyAvailable = val
		}
	}

	rooms, err := h.Service.GetRooms(onlyAvailable)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get rooms"})
		return
	}

	c.JSON(http.StatusOK, rooms)
}

func (h *RoomHandler) HandleWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade connection"})
		return
	}

	h.clientMutex.Lock()
	h.clients[conn] = true
	h.clientMutex.Unlock()

	defer func() {
		h.clientMutex.Lock()
		delete(h.clients, conn)
		h.clientMutex.Unlock()
		conn.Close()
	}()

	if rooms, err := h.Service.GetRooms(false); err == nil {
		conn.WriteJSON(rooms)
	}

	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			break
		}
	}
}

func (h *RoomHandler) broadcastRoomUpdates() {
	rooms, err := h.Service.GetRooms(false)
	if err != nil {
		return
	}

	h.clientMutex.Lock()
	defer h.clientMutex.Unlock()

	for client := range h.clients {
		if err := client.WriteJSON(rooms); err != nil {
			client.Close()
			delete(h.clients, client)
		}
	}
}

func (h *RoomHandler) BookRoom(c *gin.Context) {
	var payload struct {
		Number int `json:"number" binding:"required"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if err := h.Service.BookRoom(payload.Number); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to book room"})
		return
	}

	h.broadcastRoomUpdates()
	c.Status(http.StatusNoContent)
}

func (h *RoomHandler) ReleaseRoom(c *gin.Context) {
	var payload struct {
		Number int `json:"number" binding:"required"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if err := h.Service.ReleaseRoom(payload.Number); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to release room"})
		return
	}

	h.broadcastRoomUpdates()
	c.Status(http.StatusNoContent)
}
