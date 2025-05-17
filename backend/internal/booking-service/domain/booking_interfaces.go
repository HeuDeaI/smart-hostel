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
	UpdateExpiredBookings(ctx context.Context) error
}

type RoomRepository interface {
	Create(ctx context.Context, room *Room) error
	GetByID(ctx context.Context, id uint) (*Room, error)
	GetAll(ctx context.Context) ([]*Room, error)
	Update(ctx context.Context, room *Room) error
	Delete(ctx context.Context, id uint) error
	GetAvailableRooms(ctx context.Context, startDate, endDate time.Time) ([]*Room, error)
}
