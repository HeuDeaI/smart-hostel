package persistence

import (
	"time"
)

type Booking struct {
	ID           uint      `gorm:"primaryKey"`
	UserID       uint      `gorm:"not null"`
	RoomID       uint      `gorm:"not null"`
	CheckInDate  time.Time `gorm:"not null"`
	CheckOutDate time.Time `gorm:"not null"`
	Status       string    `gorm:"type:varchar(20);not null"`
}

type Room struct {
	ID       uint      `gorm:"primaryKey"`
	Capacity int       `gorm:"not null"`
	Bookings []Booking `gorm:"foreignKey:RoomID"`
}
