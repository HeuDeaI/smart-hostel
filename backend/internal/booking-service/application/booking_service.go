package application

import (
	"context"
	"errors"
	"time"

	"github.com/smart-hostel/backend/internal/booking-service/domain"
)

type bookingService struct {
	bookingRepo domain.BookingRepository
	roomRepo    domain.RoomRepository
}

func NewBookingService(bookingRepo domain.BookingRepository, roomRepo domain.RoomRepository) domain.BookingService {
	return &bookingService{
		bookingRepo: bookingRepo,
		roomRepo:    roomRepo,
	}
}

func (s *bookingService) CreateBooking(ctx context.Context, booking *domain.Booking) error {
	if err := booking.Validate(); err != nil {
		return err
	}

	room, err := s.roomRepo.GetByID(ctx, booking.RoomID)
	if err != nil {
		return err
	}

	if booking.PersonCount > room.GetMaxCapacity() {
		return errors.New("number of persons exceeds room capacity")
	}

	overlapping, err := s.bookingRepo.GetOverlappingBookings(ctx, booking.RoomID, booking.StartDate, booking.EndDate)
	if err != nil {
		return err
	}
	if len(overlapping) > 0 {
		return errors.New("room is already booked for this period")
	}

	return s.bookingRepo.Create(ctx, booking)
}

func (s *bookingService) GetAvailableRooms(ctx context.Context, startDate, endDate time.Time) ([]*domain.Room, error) {
	if startDate.After(endDate) {
		return nil, errors.New("start date cannot be after end date")
	}

	return s.roomRepo.GetAvailableRooms(ctx, startDate, endDate)
}

func (s *bookingService) GetUserBookings(ctx context.Context, userID uint) ([]*domain.Booking, error) {
	return s.bookingRepo.GetByUserID(ctx, userID)
}

func (s *bookingService) CancelBooking(ctx context.Context, bookingID uint) error {
	booking, err := s.bookingRepo.GetByID(ctx, bookingID)
	if err != nil {
		return err
	}

	booking.Status = domain.Cancelled
	return s.bookingRepo.Update(ctx, booking)
}

func (s *bookingService) SeedRooms(ctx context.Context) error {
	return s.roomRepo.SeedRooms(ctx)
}

func (s *bookingService) GetRoom(ctx context.Context, id uint) (*domain.Room, error) {
	return s.roomRepo.GetByID(ctx, id)
}

func (s *bookingService) GetAllRooms(ctx context.Context) ([]*domain.Room, error) {
	return s.roomRepo.GetAll(ctx)
}
