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

const (
	SingleRoomCapacity = 1
	DoubleRoomCapacity = 2
	SuiteRoomCapacity  = 4
)

type Room struct {
	ID          uint
	Number      string
	Type        RoomType
	PricePerDay float64
	Description string
}

func (r *Room) GetMaxCapacity() int {
	switch r.Type {
	case Single:
		return SingleRoomCapacity
	case Double:
		return DoubleRoomCapacity
	case Suite:
		return SuiteRoomCapacity
	default:
		return SingleRoomCapacity
	}
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

func SeedRooms() []Room {
	return []Room{
		{
			Number:      "101",
			Type:        Single,
			PricePerDay: 100.00,
			Description: "Comfortable single room with a queen-size bed",
		},
		{
			Number:      "102",
			Type:        Single,
			PricePerDay: 100.00,
			Description: "Comfortable single room with a queen-size bed",
		},
		{
			Number:      "201",
			Type:        Double,
			PricePerDay: 150.00,
			Description: "Spacious double room with two queen-size beds",
		},
		{
			Number:      "202",
			Type:        Double,
			PricePerDay: 150.00,
			Description: "Spacious double room with two queen-size beds",
		},
		{
			Number:      "301",
			Type:        Suite,
			PricePerDay: 250.00,
			Description: "Luxury suite with a king-size bed and living area",
		},
		{
			Number:      "302",
			Type:        Suite,
			PricePerDay: 250.00,
			Description: "Luxury suite with a king-size bed and living area",
		},
	}
}
