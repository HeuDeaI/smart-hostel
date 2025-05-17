package http

import (
	"time"

	"github.com/smart-hostel/backend/internal/booking-service/domain"
)

type CreateBookingDTO struct {
	UserID    uint      `json:"user_id" binding:"required"`
	RoomID    uint      `json:"room_id" binding:"required"`
	StartDate time.Time `json:"start_date" binding:"required"`
	EndDate   time.Time `json:"end_date" binding:"required"`
}

func (dto *CreateBookingDTO) ToDomain() domain.Booking {
	return domain.Booking{
		UserID:    dto.UserID,
		RoomID:    dto.RoomID,
		StartDate: dto.StartDate,
		EndDate:   dto.EndDate,
		Status:    domain.Active,
	}
}

type BookingResponseDTO struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	RoomID    uint      `json:"room_id"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func FromDomainBooking(booking domain.Booking) BookingResponseDTO {
	return BookingResponseDTO{
		ID:        booking.ID,
		UserID:    booking.UserID,
		RoomID:    booking.RoomID,
		StartDate: booking.StartDate,
		EndDate:   booking.EndDate,
		Status:    string(booking.Status),
		CreatedAt: booking.CreatedAt,
		UpdatedAt: booking.UpdatedAt,
	}
}

type CreateRoomDTO struct {
	Number      string  `json:"number" binding:"required"`
	Type        string  `json:"type" binding:"required"`
	PricePerDay float64 `json:"price_per_day" binding:"required"`
	Description string  `json:"description"`
}

func (dto *CreateRoomDTO) ToDomain() domain.Room {
	return domain.Room{
		Number:      dto.Number,
		Type:        domain.RoomType(dto.Type),
		PricePerDay: dto.PricePerDay,
		Description: dto.Description,
		IsAvailable: true,
	}
}

type RoomResponseDTO struct {
	ID          uint    `json:"id"`
	Number      string  `json:"number"`
	Type        string  `json:"type"`
	PricePerDay float64 `json:"price_per_day"`
	Description string  `json:"description"`
	IsAvailable bool    `json:"is_available"`
}

func FromDomainRoom(room domain.Room) RoomResponseDTO {
	return RoomResponseDTO{
		ID:          room.ID,
		Number:      room.Number,
		Type:        string(room.Type),
		PricePerDay: room.PricePerDay,
		Description: room.Description,
		IsAvailable: room.IsAvailable,
	}
}

type ErrorResponse struct {
	Error string `json:"error"`
}
