package domain

import (
	bookingdomain "github.com/smart-hostel/backend/internal/booking-service/domain"
	userdomain "github.com/smart-hostel/backend/internal/user-service/domain"
)

type AdminDashboard struct {
	TotalUsers     int
	TotalBookings  int
	TotalRooms     int
	RecentBookings []*bookingdomain.Booking
	RecentUsers    []userdomain.User
	Revenue        float64
}

type AdminStats struct {
	TotalRevenue    float64
	OccupancyRate   float64
	AverageStayDays float64
	PopularRooms    []string
	BookingStatus   map[string]int
	MonthlyRevenue  map[string]float64
}
