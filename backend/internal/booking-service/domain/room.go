package domain

import (
	"errors"
)

type RoomType string

const (
	Single RoomType = "single"
	Double RoomType = "double"
	Suite  RoomType = "suite"
)

type Room struct {
	ID          uint
	Number      string
	Type        RoomType
	PricePerDay float64
	Description string
	IsAvailable bool
}

func (r *Room) Validate() error {
	if r.Number == "" {
		return errors.New("room number cannot be empty")
	}

	if r.Type == "" {
		return errors.New("room type cannot be empty")
	} else if r.Type != Single && r.Type != Double && r.Type != Suite {
		return errors.New("invalid room type")
	}

	if r.PricePerDay <= 0 {
		return errors.New("price per day must be greater than 0")
	}

	return nil
}
