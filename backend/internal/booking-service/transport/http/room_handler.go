package http

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/smart-hostel/backend/internal/booking-service/application"
)

type RoomHandler struct {
	bookingService *application.BookingService
}

func NewRoomHandler(bookingService *application.BookingService) *RoomHandler {
	return &RoomHandler{bookingService: bookingService}
}

func (h *RoomHandler) CreateRoom(c *gin.Context) {
	var createDTO CreateRoomDTO
	if err := c.ShouldBindJSON(&createDTO); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	room := createDTO.ToDomain()
	if err := h.bookingService.CreateRoom(c.Request.Context(), &room); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, FromDomainRoom(room))
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

func (h *RoomHandler) UpdateRoom(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid room ID"})
		return
	}

	var updateDTO CreateRoomDTO
	if err := c.ShouldBindJSON(&updateDTO); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	room := updateDTO.ToDomain()
	room.ID = uint(id)

	if err := h.bookingService.UpdateRoom(c.Request.Context(), &room); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, FromDomainRoom(room))
}

func (h *RoomHandler) DeleteRoom(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid room ID"})
		return
	}

	if err := h.bookingService.DeleteRoom(c.Request.Context(), uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
