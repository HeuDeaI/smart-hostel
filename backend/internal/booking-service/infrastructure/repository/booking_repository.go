package repository

import (
	"context"
	"time"

	"github.com/smart-hostel/backend/internal/booking-service/domain"
	"gorm.io/gorm"
)

type bookingRepository struct {
	db *gorm.DB
}

func NewBookingRepository(db *gorm.DB) domain.BookingRepository {
	return &bookingRepository{db: db}
}

func (r *bookingRepository) Create(ctx context.Context, booking *domain.Booking) error {
	return r.db.WithContext(ctx).Create(booking).Error
}

func (r *bookingRepository) GetByID(ctx context.Context, id uint) (*domain.Booking, error) {
	var booking domain.Booking
	err := r.db.WithContext(ctx).First(&booking, id).Error
	if err != nil {
		return nil, err
	}
	return &booking, nil
}

func (r *bookingRepository) GetByUserID(ctx context.Context, userID uint) ([]*domain.Booking, error) {
	var bookings []*domain.Booking
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).Find(&bookings).Error
	if err != nil {
		return nil, err
	}
	return bookings, nil
}

func (r *bookingRepository) Update(ctx context.Context, booking *domain.Booking) error {
	return r.db.WithContext(ctx).Save(booking).Error
}

func (r *bookingRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Booking{}, id).Error
}

func (r *bookingRepository) GetOverlappingBookings(ctx context.Context, roomID uint, startDate, endDate time.Time) ([]*domain.Booking, error) {
	var bookings []*domain.Booking
	err := r.db.WithContext(ctx).
		Where("room_id = ? AND status = ? AND start_date < ? AND end_date > ?",
			roomID, domain.Active, endDate, startDate).
		Find(&bookings).Error
	if err != nil {
		return nil, err
	}
	return bookings, nil
}
