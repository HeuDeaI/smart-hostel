package http

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/smart-hostel/backend/internal/booking-service/domain"
)

type RoomHandler struct {
	bookingService domain.BookingService
}

func NewRoomHandler(bookingService domain.BookingService) *RoomHandler {
	return &RoomHandler{bookingService: bookingService}
}

func (h *RoomHandler) SeedRooms(c *gin.Context) {
	if err := h.bookingService.SeedRooms(c.Request.Context()); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.Status(http.StatusCreated)
}

func (h *RoomHandler) GetRoom(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid room ID"})
		return
	}

	room, err := h.bookingService.GetRoom(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: "Room not found"})
		return
	}

	c.JSON(http.StatusOK, FromDomainRoom(*room))
}

func (h *RoomHandler) GetAllRooms(c *gin.Context) {
	rooms, err := h.bookingService.GetAllRooms(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	response := make([]RoomResponseDTO, len(rooms))
	for i, room := range rooms {
		response[i] = FromDomainRoom(*room)
	}

	c.JSON(http.StatusOK, response)
}
