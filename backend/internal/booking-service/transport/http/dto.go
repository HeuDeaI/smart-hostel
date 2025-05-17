package http

import (
	"time"

	"github.com/smart-hostel/backend/internal/booking-service/domain"
)

type CreateBookingDTO struct {
	UserID      uint      `json:"user_id" binding:"required"`
	RoomID      uint      `json:"room_id" binding:"required"`
	StartDate   time.Time `json:"start_date" binding:"required"`
	EndDate     time.Time `json:"end_date" binding:"required"`
	PersonCount int       `json:"person_count" binding:"omitempty,min=1"`
}

func (dto *CreateBookingDTO) ToDomain() domain.Booking {
	personCount := dto.PersonCount
	if personCount <= 0 {
		personCount = 1
	}

	return domain.Booking{
		UserID:      dto.UserID,
		RoomID:      dto.RoomID,
		StartDate:   dto.StartDate,
		EndDate:     dto.EndDate,
		PersonCount: personCount,
		Status:      domain.Active,
	}
}

type BookingResponseDTO struct {
	ID          uint      `json:"id"`
	UserID      uint      `json:"user_id"`
	RoomID      uint      `json:"room_id"`
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date"`
	Status      string    `json:"status"`
	PersonCount int       `json:"person_count"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func FromDomainBooking(booking domain.Booking) BookingResponseDTO {
	return BookingResponseDTO{
		ID:          booking.ID,
		UserID:      booking.UserID,
		RoomID:      booking.RoomID,
		StartDate:   booking.StartDate,
		EndDate:     booking.EndDate,
		Status:      string(booking.Status),
		PersonCount: booking.PersonCount,
		CreatedAt:   booking.CreatedAt,
		UpdatedAt:   booking.UpdatedAt,
	}
}

type RoomResponseDTO struct {
	ID          uint    `json:"id"`
	Number      string  `json:"number"`
	Type        string  `json:"type"`
	PricePerDay float64 `json:"price_per_day"`
	Description string  `json:"description"`
}

func FromDomainRoom(room domain.Room) RoomResponseDTO {
	return RoomResponseDTO{
		ID:          room.ID,
		Number:      room.Number,
		Type:        string(room.Type),
		PricePerDay: room.PricePerDay,
		Description: room.Description,
	}
}

type ErrorResponse struct {
	Error string `json:"error"`
}
