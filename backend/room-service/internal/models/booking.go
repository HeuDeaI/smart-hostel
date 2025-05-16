package models

import "time"

type Booking struct {
	ID     uint      `gorm:"primaryKey" json:"id"`
	UserID uint      `gorm:"not null" json:"user_id"`
	RoomID uint      `gorm:"not null" json:"room_id"`
	Start  time.Time `json:"start"`
	End    time.Time `json:"end"`
}
