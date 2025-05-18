package domain

import (
	"context"
	"time"

	bookingdomain "github.com/smart-hostel/backend/internal/booking-service/domain"
	userdomain "github.com/smart-hostel/backend/internal/user-service/domain"
)

type AdminService interface {
	GetDashboard(ctx context.Context) (*AdminDashboard, error)
	GetStats(ctx context.Context, startDate, endDate time.Time) (*AdminStats, error)

	CreateUser(ctx context.Context, user *userdomain.User) (*userdomain.User, error)
	GetAllUsers(ctx context.Context) ([]userdomain.User, error)
	UpdateUserRole(ctx context.Context, userID uint, role userdomain.Role) error
	DeleteUser(ctx context.Context, userID uint) error

	CreateBooking(ctx context.Context, booking *bookingdomain.Booking) error
	GetAllBookings(ctx context.Context) ([]*bookingdomain.Booking, error)
	DeleteBooking(ctx context.Context, bookingID uint) error
	GetAllRooms(ctx context.Context) ([]*bookingdomain.Room, error)

}
