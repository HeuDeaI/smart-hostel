package repository

import (
	"context"
	"time"

	"github.com/smart-hostel/backend/internal/booking-service/domain"
	"gorm.io/gorm"
)

type RoomRepository struct {
	db *gorm.DB
}

func NewRoomRepository(db *gorm.DB) *RoomRepository {
	return &RoomRepository{db: db}
}

func (r *RoomRepository) Create(ctx context.Context, room *domain.Room) error {
	return r.db.WithContext(ctx).Create(room).Error
}

func (r *RoomRepository) GetByID(ctx context.Context, id uint) (*domain.Room, error) {
	var room domain.Room
	err := r.db.WithContext(ctx).First(&room, id).Error
	if err != nil {
		return nil, err
	}
	return &room, nil
}

func (r *RoomRepository) GetAll(ctx context.Context) ([]*domain.Room, error) {
	var rooms []*domain.Room
	err := r.db.WithContext(ctx).Find(&rooms).Error
	if err != nil {
		return nil, err
	}
	return rooms, nil
}

func (r *RoomRepository) Update(ctx context.Context, room *domain.Room) error {
	return r.db.WithContext(ctx).Save(room).Error
}

func (r *RoomRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Room{}, id).Error
}

func (r *RoomRepository) GetAvailableRooms(ctx context.Context, startDate, endDate time.Time) ([]*domain.Room, error) {
	var rooms []*domain.Room
	subQuery := r.db.Model(&domain.Booking{}).
		Select("room_id").
		Where("status = ? AND ((start_date <= ? AND end_date >= ?) OR (start_date <= ? AND end_date >= ?))",
			domain.Active, endDate, startDate, endDate, startDate)

	err := r.db.WithContext(ctx).
		Where("is_available = ? AND id NOT IN (?)", true, subQuery).
		Find(&rooms).Error
	if err != nil {
		return nil, err
	}
	return rooms, nil
}
