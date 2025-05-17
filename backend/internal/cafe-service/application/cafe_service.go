package application

import (
	"context"
	"errors"

	"github.com/smart-hostel/backend/internal/cafe-service/domain"
)

type cafeService struct {
	menuRepo  domain.MenuRepository
	orderRepo domain.OrderRepository
}

func NewCafeService(menuRepo domain.MenuRepository, orderRepo domain.OrderRepository) domain.CafeService {
	return &cafeService{
		menuRepo:  menuRepo,
		orderRepo: orderRepo,
	}
}

func (s *cafeService) SeedMenuItems(ctx context.Context) error {
	return s.menuRepo.SeedMenuItems(ctx)
}

func (s *cafeService) GetMenuItem(ctx context.Context, id uint) (*domain.MenuItem, error) {
	return s.menuRepo.GetByID(ctx, id)
}

func (s *cafeService) GetAllMenuItems(ctx context.Context) ([]*domain.MenuItem, error) {
	return s.menuRepo.GetAll(ctx)
}

func (s *cafeService) GetMenuItemsByCategory(ctx context.Context, category domain.MenuCategory) ([]*domain.MenuItem, error) {
	return s.menuRepo.GetByCategory(ctx, category)
}

func (s *cafeService) CreateOrder(ctx context.Context, order *domain.Order) error {
	if err := order.Validate(); err != nil {
		return err
	}

	for _, item := range order.Items {
		menuItem, err := s.menuRepo.GetByID(ctx, item.MenuItemID)
		if err != nil {
			return err
		}
		if !menuItem.IsAvailable {
			return errors.New("item is not available: " + menuItem.Name)
		}
	}

	return s.orderRepo.Create(ctx, order)
}

func (s *cafeService) GetOrder(ctx context.Context, id uint) (*domain.Order, error) {
	return s.orderRepo.GetByID(ctx, id)
}

func (s *cafeService) GetUserOrders(ctx context.Context, userID uint) ([]*domain.Order, error) {
	return s.orderRepo.GetByUserID(ctx, userID)
}

func (s *cafeService) UpdateOrderStatus(ctx context.Context, id uint, status domain.OrderStatus) error {
	return s.orderRepo.UpdateStatus(ctx, id, status)
}
