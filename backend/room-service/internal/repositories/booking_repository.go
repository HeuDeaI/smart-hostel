package repositories

import (
	"room-service/internal/models"

	"gorm.io/gorm"
)

type BookingRepository interface {
	CreateBooking(booking *models.Booking) error
	GetBookingByID(id uint) (*models.Booking, error)
	GetAllBookings() ([]models.Booking, error)
	UpdateBooking(booking *models.Booking) error
	DeleteBooking(id uint) error
}

type bookingRepository struct {
	db *gorm.DB
}

func NewBookingRepository(db *gorm.DB) BookingRepository {
	return &bookingRepository{db: db}
}

func (r *bookingRepository) CreateBooking(booking *models.Booking) error {
	return r.db.Create(booking).Error
}

func (r *bookingRepository) GetBookingByID(id uint) (*models.Booking, error) {
	var booking models.Booking
	if err := r.db.First(&booking, id).Error; err != nil {
		return nil, err
	}
	return &booking, nil
}

func (r *bookingRepository) GetAllBookings() ([]models.Booking, error) {
	var bookings []models.Booking
	if err := r.db.Find(&bookings).Error; err != nil {
		return nil, err
	}
	return bookings, nil
}

func (r *bookingRepository) UpdateBooking(booking *models.Booking) error {
	return r.db.Save(booking).Error
}

func (r *bookingRepository) DeleteBooking(id uint) error {
	return r.db.Delete(&models.Booking{}, id).Error
}
