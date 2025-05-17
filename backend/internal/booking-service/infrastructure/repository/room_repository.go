package repository

import (
	"context"
	"time"

	"github.com/smart-hostel/backend/internal/booking-service/domain"
	"gorm.io/gorm"
)

type roomRepository struct {
	db *gorm.DB
}

func NewRoomRepository(db *gorm.DB) domain.RoomRepository {
	return &roomRepository{db: db}
}

func (r *roomRepository) SeedRooms(ctx context.Context) error {
	rooms := domain.SeedRooms()
	return r.db.WithContext(ctx).Create(&rooms).Error
}

func (r *roomRepository) GetByID(ctx context.Context, id uint) (*domain.Room, error) {
	var room domain.Room
	err := r.db.WithContext(ctx).First(&room, id).Error
	if err != nil {
		return nil, err
	}
	return &room, nil
}

func (r *roomRepository) GetAll(ctx context.Context) ([]*domain.Room, error) {
	var rooms []*domain.Room
	err := r.db.WithContext(ctx).Find(&rooms).Error
	if err != nil {
		return nil, err
	}
	return rooms, nil
}

func (r *roomRepository) Update(ctx context.Context, room *domain.Room) error {
	return r.db.WithContext(ctx).Save(room).Error
}

func (r *roomRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Room{}, id).Error
}

func (r *roomRepository) GetAvailableRooms(ctx context.Context, startDate, endDate time.Time) ([]*domain.Room, error) {
	var rooms []*domain.Room
	subQuery := r.db.Model(&domain.Booking{}).
		Select("room_id").
		Where("status = ? AND start_date < ? AND end_date > ?",
			domain.Active, endDate, startDate)

	err := r.db.WithContext(ctx).
		Where("id NOT IN (?)", subQuery).
		Find(&rooms).Error
	if err != nil {
		return nil, err
	}
	return rooms, nil
}
