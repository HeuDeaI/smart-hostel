package application

import (
	"context"
	"errors"
	"time"

	"github.com/smart-hostel/backend/internal/booking-service/domain"
)

type BookingService struct {
	bookingRepo domain.BookingRepository
	roomRepo    domain.RoomRepository
}

func NewBookingService(bookingRepo domain.BookingRepository, roomRepo domain.RoomRepository) *BookingService {
	return &BookingService{
		bookingRepo: bookingRepo,
		roomRepo:    roomRepo,
	}
}

func (s *BookingService) CreateBooking(ctx context.Context, booking *domain.Booking) error {
	if err := booking.Validate(); err != nil {
		return err
	}

	// Check if room exists and is available
	room, err := s.roomRepo.GetByID(ctx, booking.RoomID)
	if err != nil {
		return err
	}
	if !room.IsAvailable {
		return errors.New("room is not available")
	}

	// Check for overlapping bookings
	overlapping, err := s.bookingRepo.GetOverlappingBookings(ctx, booking.RoomID, booking.StartDate, booking.EndDate)
	if err != nil {
		return err
	}
	if len(overlapping) > 0 {
		return errors.New("room is already booked for this period")
	}

	return s.bookingRepo.Create(ctx, booking)
}

func (s *BookingService) GetAvailableRooms(ctx context.Context, startDate, endDate time.Time) ([]*domain.Room, error) {
	if startDate.After(endDate) {
		return nil, errors.New("start date cannot be after end date")
	}

	return s.roomRepo.GetAvailableRooms(ctx, startDate, endDate)
}

func (s *BookingService) GetUserBookings(ctx context.Context, userID uint) ([]*domain.Booking, error) {
	return s.bookingRepo.GetByUserID(ctx, userID)
}

func (s *BookingService) CancelBooking(ctx context.Context, bookingID uint) error {
	booking, err := s.bookingRepo.GetByID(ctx, bookingID)
	if err != nil {
		return err
	}

	booking.Status = domain.Cancelled
	return s.bookingRepo.Update(ctx, booking)
}

func (s *BookingService) UpdateExpiredBookings(ctx context.Context) error {
	return s.bookingRepo.UpdateExpiredBookings(ctx)
}

// Room management methods
func (s *BookingService) CreateRoom(ctx context.Context, room *domain.Room) error {
	if err := room.Validate(); err != nil {
		return err
	}
	return s.roomRepo.Create(ctx, room)
}

func (s *BookingService) GetRoom(ctx context.Context, id uint) (*domain.Room, error) {
	return s.roomRepo.GetByID(ctx, id)
}

func (s *BookingService) GetAllRooms(ctx context.Context) ([]*domain.Room, error) {
	return s.roomRepo.GetAll(ctx)
}

func (s *BookingService) UpdateRoom(ctx context.Context, room *domain.Room) error {
	if err := room.Validate(); err != nil {
		return err
	}
	return s.roomRepo.Update(ctx, room)
}

func (s *BookingService) DeleteRoom(ctx context.Context, id uint) error {
	return s.roomRepo.Delete(ctx, id)
}
