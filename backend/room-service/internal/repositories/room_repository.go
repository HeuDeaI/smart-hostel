package repositories

import (
	"gorm.io/gorm"
	"room-service/internal/models"
)

type RoomRepository interface {
	SeedRooms() error
	GetRooms(onlyAvailable bool) ([]models.Room, error)
	BookRoom(number int) error
	ReleaseRoom(number int) error
}

type roomRepository struct {
	db *gorm.DB
}

func NewRoomRepository(db *gorm.DB) RoomRepository {
	return &roomRepository{db: db}
}

func (r *roomRepository) SeedRooms() error {
	var count int64
	r.db.Model(&models.Room{}).Count(&count)

	if count == 0 {
		return r.db.Create([]models.Room{
			{Number: 101}, {Number: 102}, {Number: 103},
			{Number: 201}, {Number: 202}, {Number: 203},
			{Number: 301}, {Number: 302}, {Number: 303},
		}).Error
	}
	return nil
}

func (r *roomRepository) GetRooms(onlyAvailable bool) ([]models.Room, error) {
	var rooms []models.Room
	var err error

	if onlyAvailable {
		err = r.db.Where("is_booked = ?", false).Find(&rooms).Error
	} else {
		err = r.db.Find(&rooms).Error
	}

	return rooms, err
}

func (r *roomRepository) BookRoom(number int) error {
	return r.db.Model(&models.Room{}).Where("number = ? AND is_booked = false", number).
		Update("is_booked", true).Error
}

func (r *roomRepository) ReleaseRoom(number int) error {
	return r.db.Model(&models.Room{}).Where("number = ? AND is_booked = true", number).
		Update("is_booked", false).Error
}
