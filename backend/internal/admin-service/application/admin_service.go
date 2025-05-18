package application

import (
	"context"
	"time"

	admindomain "github.com/smart-hostel/backend/internal/admin-service/domain"
	bookingdomain "github.com/smart-hostel/backend/internal/booking-service/domain"
	userdomain "github.com/smart-hostel/backend/internal/user-service/domain"
)

type adminService struct {
	userService    userdomain.UserService
	bookingService bookingdomain.BookingService
	roomService    bookingdomain.RoomRepository
}

func NewAdminService(
	userService userdomain.UserService,
	bookingService bookingdomain.BookingService,
	roomService bookingdomain.RoomRepository,
) admindomain.AdminService {
	return &adminService{
		userService:    userService,
		bookingService: bookingService,
		roomService:    roomService,
	}
}

func (s *adminService) GetDashboard(ctx context.Context) (*admindomain.AdminDashboard, error) {
	users, err := s.userService.GetAllUsers(ctx)
	if err != nil {
		return nil, err
	}

	rooms, err := s.roomService.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	var allBookings []*bookingdomain.Booking
	for _, user := range users {
		userBookings, err := s.bookingService.GetUserBookings(ctx, user.ID)
		if err != nil {
			return nil, err
		}
		allBookings = append(allBookings, userBookings...)
	}

	var totalRevenue float64
	for _, booking := range allBookings {
		for _, room := range rooms {
			if room.ID == booking.RoomID {
				duration := booking.EndDate.Sub(booking.StartDate).Hours() / 24
				totalRevenue += room.PricePerDay * duration
				break
			}
		}
	}

	var recentBookings []*bookingdomain.Booking
	if len(allBookings) > 0 {
		start := len(allBookings) - 5
		if start < 0 {
			start = 0
		}
		recentBookings = allBookings[start:]
	}

	var recentUsers []userdomain.User
	if len(users) > 0 {
		start := len(users) - 5
		if start < 0 {
			start = 0
		}
		recentUsers = users[start:]
	}

	return &admindomain.AdminDashboard{
		TotalUsers:     len(users),
		TotalBookings:  len(allBookings),
		TotalRooms:     len(rooms),
		RecentBookings: recentBookings,
		RecentUsers:    recentUsers,
		Revenue:        totalRevenue,
	}, nil
}

func (s *adminService) GetStats(ctx context.Context, startDate, endDate time.Time) (*admindomain.AdminStats, error) {
	users, err := s.userService.GetAllUsers(ctx)
	if err != nil {
		return nil, err
	}

	rooms, err := s.roomService.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	var allBookings []*bookingdomain.Booking
	for _, user := range users {
		userBookings, err := s.bookingService.GetUserBookings(ctx, user.ID)
		if err != nil {
			return nil, err
		}
		allBookings = append(allBookings, userBookings...)
	}

	stats := &admindomain.AdminStats{
		BookingStatus:  make(map[string]int),
		MonthlyRevenue: make(map[string]float64),
	}

	var totalRevenue float64
	var totalStayDays float64
	var totalBookings int

	roomBookings := make(map[uint]int)

	for _, booking := range allBookings {
		if booking.StartDate.Before(startDate) || booking.EndDate.After(endDate) {
			continue
		}

		for _, room := range rooms {
			if room.ID == booking.RoomID {
				duration := booking.EndDate.Sub(booking.StartDate).Hours() / 24
				revenue := room.PricePerDay * duration
				totalRevenue += revenue
				totalStayDays += duration
				totalBookings++

				roomBookings[room.ID]++

				month := booking.StartDate.Format("2006-01")
				stats.MonthlyRevenue[month] += revenue

				break
			}
		}

		stats.BookingStatus[string(booking.Status)]++
	}

	if len(rooms) > 0 {
		totalRoomDays := float64(len(rooms)) * endDate.Sub(startDate).Hours() / 24
		if totalRoomDays > 0 {
			stats.OccupancyRate = (totalStayDays / totalRoomDays) * 100
		}
	}

	if totalBookings > 0 {
		stats.AverageStayDays = totalStayDays / float64(totalBookings)
	}

	stats.PopularRooms = make([]string, 0)
	for roomID := range roomBookings {
		for _, room := range rooms {
			if room.ID == roomID {
				stats.PopularRooms = append(stats.PopularRooms, room.Number)
				break
			}
		}
	}

	stats.TotalRevenue = totalRevenue

	return stats, nil
}

func (s *adminService) GetAllUsers(ctx context.Context) ([]userdomain.User, error) {
	return s.userService.GetAllUsers(ctx)
}

func (s *adminService) GetAllBookings(ctx context.Context) ([]*bookingdomain.Booking, error) {
	users, err := s.userService.GetAllUsers(ctx)
	if err != nil {
		return nil, err
	}

	var allBookings []*bookingdomain.Booking
	for _, user := range users {
		userBookings, err := s.bookingService.GetUserBookings(ctx, user.ID)
		if err != nil {
			return nil, err
		}
		allBookings = append(allBookings, userBookings...)
	}

	return allBookings, nil
}

func (s *adminService) GetAllRooms(ctx context.Context) ([]*bookingdomain.Room, error) {
	return s.roomService.GetAll(ctx)
}

func (s *adminService) UpdateUserRole(ctx context.Context, userID uint, role userdomain.Role) error {
	user, err := s.userService.GetUserByID(ctx, userID)
	if err != nil {
		return err
	}

	user.Role = role
	_, err = s.userService.UpdateUser(ctx, user)
	return err
}

func (s *adminService) DeleteUser(ctx context.Context, userID uint) error {
	return s.userService.DeleteUser(ctx, userID)
}

func (s *adminService) DeleteBooking(ctx context.Context, bookingID uint) error {
	return s.bookingService.CancelBooking(ctx, bookingID)
}

func (s *adminService) CreateUser(ctx context.Context, user *userdomain.User) (*userdomain.User, error) {
	if err := user.Validate(); err != nil {
		return nil, err
	}
	return s.userService.RegisterUser(ctx, user)
}

func (s *adminService) CreateBooking(ctx context.Context, booking *bookingdomain.Booking) error {
	if err := booking.Validate(); err != nil {
		return err
	}
	return s.bookingService.CreateBooking(ctx, booking)
}
