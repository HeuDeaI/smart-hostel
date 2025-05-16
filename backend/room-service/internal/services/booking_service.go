package services

import (
	"room-service/internal/models"
	"room-service/internal/repositories"
)

type BookingService interface {
	CreateBooking(booking *models.Booking) error
	GetBookingByID(id uint) (*models.Booking, error)
	GetAllBookings() ([]models.Booking, error)
	UpdateBooking(booking *models.Booking) error
	DeleteBooking(id uint) error
}

type bookingService struct {
	repo repositories.BookingRepository
}

func NewBookingService(repo repositories.BookingRepository) BookingService {
	return &bookingService{repo: repo}
}

func (s *bookingService) CreateBooking(booking *models.Booking) error {
	return s.repo.CreateBooking(booking)
}

func (s *bookingService) GetBookingByID(id uint) (*models.Booking, error) {
	return s.repo.GetBookingByID(id)
}

func (s *bookingService) GetAllBookings() ([]models.Booking, error) {
	return s.repo.GetAllBookings()
}

func (s *bookingService) UpdateBooking(booking *models.Booking) error {
	return s.repo.UpdateBooking(booking)
}

func (s *bookingService) DeleteBooking(id uint) error {
	return s.repo.DeleteBooking(id)
}
