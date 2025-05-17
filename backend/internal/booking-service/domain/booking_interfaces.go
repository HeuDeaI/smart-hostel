package domain

import (
	"context"
	"time"
)

type BookingRepository interface {
	Create(ctx context.Context, booking *Booking) error
	GetByID(ctx context.Context, id uint) (*Booking, error)
	GetByUserID(ctx context.Context, userID uint) ([]*Booking, error)
	Update(ctx context.Context, booking *Booking) error
	Delete(ctx context.Context, id uint) error
	GetOverlappingBookings(ctx context.Context, roomID uint, startDate, endDate time.Time) ([]*Booking, error)
}

type RoomRepository interface {
	SeedRooms(ctx context.Context) error
	GetByID(ctx context.Context, id uint) (*Room, error)
	GetAll(ctx context.Context) ([]*Room, error)
	GetAvailableRooms(ctx context.Context, startDate, endDate time.Time) ([]*Room, error)
}

type BookingService interface {
	CreateBooking(ctx context.Context, booking *Booking) error
	GetAvailableRooms(ctx context.Context, startDate, endDate time.Time) ([]*Room, error)
	GetUserBookings(ctx context.Context, userID uint) ([]*Booking, error)
	CancelBooking(ctx context.Context, bookingID uint) error
	SeedRooms(ctx context.Context) error
	GetRoom(ctx context.Context, id uint) (*Room, error)
	GetAllRooms(ctx context.Context) ([]*Room, error)
}
