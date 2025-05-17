package domain

import (
	"context"
)

type MenuRepository interface {
	SeedMenuItems(ctx context.Context) error
	GetByID(ctx context.Context, id uint) (*MenuItem, error)
	GetAll(ctx context.Context) ([]*MenuItem, error)
	GetByCategory(ctx context.Context, category MenuCategory) ([]*MenuItem, error)
}

type OrderRepository interface {
	Create(ctx context.Context, order *Order) error
	GetByID(ctx context.Context, id uint) (*Order, error)
	GetByUserID(ctx context.Context, userID uint) ([]*Order, error)
	Update(ctx context.Context, order *Order) error
	UpdateStatus(ctx context.Context, id uint, status OrderStatus) error
}

type CafeService interface {
	SeedMenuItems(ctx context.Context) error
	GetMenuItem(ctx context.Context, id uint) (*MenuItem, error)
	GetAllMenuItems(ctx context.Context) ([]*MenuItem, error)
	GetMenuItemsByCategory(ctx context.Context, category MenuCategory) ([]*MenuItem, error)
	CreateOrder(ctx context.Context, order *Order) error
	GetOrder(ctx context.Context, id uint) (*Order, error)
	GetUserOrders(ctx context.Context, userID uint) ([]*Order, error)
	UpdateOrderStatus(ctx context.Context, id uint, status OrderStatus) error
}
