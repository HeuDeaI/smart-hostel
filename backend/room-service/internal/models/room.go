package models

type Room struct {
	ID       uint      `gorm:"primaryKey" json:"id"`
	Number   int       `gorm:"unique;not null" json:"number"`
	IsBooked bool      `gorm:"default:false" json:"is_booked"`
	Bookings []Booking `gorm:"foreignKey:RoomID"`
}
