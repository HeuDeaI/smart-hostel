package domain

import (
	"errors"
	"time"
)

type BookingStatus string

const (
	Active    BookingStatus = "active"
	Cancelled BookingStatus = "cancelled"
	Completed BookingStatus = "completed"
)

type Booking struct {
	ID          uint
	UserID      uint
	RoomID      uint
	StartDate   time.Time
	EndDate     time.Time
	Status      BookingStatus
	PersonCount int
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func (b *Booking) Validate() error {
	if b.UserID == 0 {
		return errors.New("user ID cannot be empty")
	}

	if b.RoomID == 0 {
		return errors.New("room ID cannot be empty")
	}

	if b.StartDate.IsZero() {
		return errors.New("start date cannot be empty")
	}

	if b.EndDate.IsZero() {
		return errors.New("end date cannot be empty")
	}

	if b.EndDate.Before(b.StartDate) {
		return errors.New("end date cannot be before start date")
	}

	if b.PersonCount <= 0 {
		return errors.New("person count must be greater than 0")
	}

	if b.Status == "" {
		b.Status = Active
	} else if b.Status != Active && b.Status != Cancelled && b.Status != Completed {
		return errors.New("invalid booking status")
	}

	return nil
}

func (b *Booking) IsOverlapping(start, end time.Time) bool {
	return (b.StartDate.Before(end) && b.EndDate.After(start))
}
