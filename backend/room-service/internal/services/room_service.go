package services

import (
	"room-service/internal/models"
	"room-service/internal/repositories"
)

type RoomService interface {
	SeedRooms() error
	GetRooms(onlyAvailable bool) ([]models.Room, error)
	BookRoom(number int) error
	ReleaseRoom(number int) error
}

type roomService struct {
	repo repositories.RoomRepository
}

func NewRoomService(repo repositories.RoomRepository) RoomService {
	return &roomService{repo: repo}
}

func (s *roomService) SeedRooms() error {
	return s.repo.SeedRooms()
}

func (s *roomService) GetRooms(onlyAvailable bool) ([]models.Room, error) {
	return s.repo.GetRooms(onlyAvailable)
}

func (s *roomService) BookRoom(number int) error {
	return s.repo.BookRoom(number)
}

func (s *roomService) ReleaseRoom(number int) error {
	return s.repo.ReleaseRoom(number)
}
