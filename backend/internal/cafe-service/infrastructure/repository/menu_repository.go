package repository

import (
	"context"

	"github.com/smart-hostel/backend/internal/cafe-service/domain"
	"github.com/smart-hostel/backend/internal/cafe-service/infrastructure/persistence"
	"gorm.io/gorm"
)

type menuRepository struct {
	db *gorm.DB
}

func NewMenuRepository(db *gorm.DB) domain.MenuRepository {
	return &menuRepository{db: db}
}

func (r *menuRepository) SeedMenuItems(ctx context.Context) error {
	items := domain.SeedMenuItems()
	var dbItems []persistence.MenuItem

	for _, item := range items {
		dbItems = append(dbItems, persistence.MenuItem{
			Name:        item.Name,
			Description: item.Description,
			Price:       item.Price,
			Category:    string(item.Category),
			ImageURL:    item.ImageURL,
			IsAvailable: item.IsAvailable,
		})
	}

	return r.db.WithContext(ctx).Create(&dbItems).Error
}

func (r *menuRepository) GetByID(ctx context.Context, id uint) (*domain.MenuItem, error) {
	var item persistence.MenuItem
	if err := r.db.WithContext(ctx).First(&item, id).Error; err != nil {
		return nil, err
	}

	return &domain.MenuItem{
		ID:          item.ID,
		Name:        item.Name,
		Description: item.Description,
		Price:       item.Price,
		Category:    domain.MenuCategory(item.Category),
		ImageURL:    item.ImageURL,
		IsAvailable: item.IsAvailable,
	}, nil
}

func (r *menuRepository) GetAll(ctx context.Context) ([]*domain.MenuItem, error) {
	var items []persistence.MenuItem
	if err := r.db.WithContext(ctx).Find(&items).Error; err != nil {
		return nil, err
	}

	var domainItems []*domain.MenuItem
	for _, item := range items {
		domainItems = append(domainItems, &domain.MenuItem{
			ID:          item.ID,
			Name:        item.Name,
			Description: item.Description,
			Price:       item.Price,
			Category:    domain.MenuCategory(item.Category),
			ImageURL:    item.ImageURL,
			IsAvailable: item.IsAvailable,
		})
	}

	return domainItems, nil
}

func (r *menuRepository) GetByCategory(ctx context.Context, category domain.MenuCategory) ([]*domain.MenuItem, error) {
	var items []persistence.MenuItem
	if err := r.db.WithContext(ctx).Where("category = ?", category).Find(&items).Error; err != nil {
		return nil, err
	}

	var domainItems []*domain.MenuItem
	for _, item := range items {
		domainItems = append(domainItems, &domain.MenuItem{
			ID:          item.ID,
			Name:        item.Name,
			Description: item.Description,
			Price:       item.Price,
			Category:    domain.MenuCategory(item.Category),
			ImageURL:    item.ImageURL,
			IsAvailable: item.IsAvailable,
		})
	}

	return domainItems, nil
}
