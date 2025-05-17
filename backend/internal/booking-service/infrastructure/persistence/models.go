package persistence

import (
	"time"

	"gorm.io/gorm"
)

type Booking struct {
	gorm.Model
	UserID      uint      `gorm:"not null"`
	RoomID      uint      `gorm:"not null"`
	StartDate   time.Time `gorm:"not null"`
	EndDate     time.Time `gorm:"not null"`
	Status      string    `gorm:"type:varchar(20);not null"`
	PersonCount int       `gorm:"not null;default:1"`
}

type Room struct {
	gorm.Model
	Number      string    `gorm:"type:varchar(10);not null;unique"`
	Type        string    `gorm:"type:varchar(20);not null"`
	PricePerDay float64   `gorm:"not null"`
	Description string    `gorm:"type:text"`
	Bookings    []Booking `gorm:"foreignKey:RoomID"`
}
