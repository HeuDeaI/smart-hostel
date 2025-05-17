package domain

import (
	"time"
)

type Booking struct {
	ID           uint
	UserID       uint
	RoomID       uint
	CheckInDate  time.Time
	CheckOutDate time.Time
	Status       string
}

type Room struct {
	ID       uint
	Capacity int
}
