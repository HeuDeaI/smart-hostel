package domain

import "context"

type BookingRepository interface {
	Create(ctx context.Context, booking *Booking) error
	FindByID(ctx context.Context, id uint) (*Booking, error)
	Update(ctx context.Context, booking *Booking) error
	Delete(ctx context.Context, id uint) error
}
