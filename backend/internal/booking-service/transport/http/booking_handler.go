package http

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/smart-hostel/backend/internal/booking-service/domain"
)

type BookingHandler struct {
	bookingService domain.BookingService
}

func NewBookingHandler(bookingService domain.BookingService) *BookingHandler {
	return &BookingHandler{bookingService: bookingService}
}

func (h *BookingHandler) CreateBooking(c *gin.Context) {
	var createDTO CreateBookingDTO
	if err := c.ShouldBindJSON(&createDTO); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	booking := createDTO.ToDomain()
	if err := h.bookingService.CreateBooking(c.Request.Context(), &booking); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, FromDomainBooking(booking))
}

func (h *BookingHandler) GetAvailableRooms(c *gin.Context) {
	startDate, err := time.Parse(time.RFC3339, c.Query("start_date"))
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid start date format"})
		return
	}

	endDate, err := time.Parse(time.RFC3339, c.Query("end_date"))
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid end date format"})
		return
	}

	rooms, err := h.bookingService.GetAvailableRooms(c.Request.Context(), startDate, endDate)
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

func (h *BookingHandler) GetUserBookings(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("user_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid user ID"})
		return
	}

	bookings, err := h.bookingService.GetUserBookings(c.Request.Context(), uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	response := make([]BookingResponseDTO, len(bookings))
	for i, booking := range bookings {
		response[i] = FromDomainBooking(*booking)
	}

	c.JSON(http.StatusOK, response)
}

func (h *BookingHandler) CancelBooking(c *gin.Context) {
	bookingID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid booking ID"})
		return
	}

	if err := h.bookingService.CancelBooking(c.Request.Context(), uint(bookingID)); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
