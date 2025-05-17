package repository

import (
	"context"

	"github.com/smart-hostel/backend/internal/cafe-service/domain"
	"github.com/smart-hostel/backend/internal/cafe-service/infrastructure/persistence"
	"gorm.io/gorm"
)

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) domain.OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) Create(ctx context.Context, order *domain.Order) error {
	dbOrder := persistence.Order{
		UserID:      order.UserID,
		TotalAmount: order.TotalAmount,
		Status:      string(order.Status),
	}

	var dbItems []persistence.OrderItem
	for _, item := range order.Items {
		dbItems = append(dbItems, persistence.OrderItem{
			MenuItemID: item.MenuItemID,
			Quantity:   item.Quantity,
			Price:      item.Price,
		})
	}

	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&dbOrder).Error; err != nil {
			return err
		}

		for i := range dbItems {
			dbItems[i].OrderID = dbOrder.ID
		}

		if err := tx.Create(&dbItems).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *orderRepository) GetByID(ctx context.Context, id uint) (*domain.Order, error) {
	var dbOrder persistence.Order
	if err := r.db.WithContext(ctx).Preload("Items").First(&dbOrder, id).Error; err != nil {
		return nil, err
	}

	var items []domain.OrderItem
	for _, item := range dbOrder.Items {
		items = append(items, domain.OrderItem{
			MenuItemID: item.MenuItemID,
			Quantity:   item.Quantity,
			Price:      item.Price,
		})
	}

	return &domain.Order{
		ID:          dbOrder.ID,
		UserID:      dbOrder.UserID,
		Items:       items,
		TotalAmount: dbOrder.TotalAmount,
		Status:      domain.OrderStatus(dbOrder.Status),
		CreatedAt:   dbOrder.CreatedAt,
		UpdatedAt:   dbOrder.UpdatedAt,
	}, nil
}

func (r *orderRepository) GetByUserID(ctx context.Context, userID uint) ([]*domain.Order, error) {
	var dbOrders []persistence.Order
	if err := r.db.WithContext(ctx).Preload("Items").Where("user_id = ?", userID).Find(&dbOrders).Error; err != nil {
		return nil, err
	}

	var orders []*domain.Order
	for _, dbOrder := range dbOrders {
		var items []domain.OrderItem
		for _, item := range dbOrder.Items {
			items = append(items, domain.OrderItem{
				MenuItemID: item.MenuItemID,
				Quantity:   item.Quantity,
				Price:      item.Price,
			})
		}

		orders = append(orders, &domain.Order{
			ID:          dbOrder.ID,
			UserID:      dbOrder.UserID,
			Items:       items,
			TotalAmount: dbOrder.TotalAmount,
			Status:      domain.OrderStatus(dbOrder.Status),
			CreatedAt:   dbOrder.CreatedAt,
			UpdatedAt:   dbOrder.UpdatedAt,
		})
	}

	return orders, nil
}

func (r *orderRepository) Update(ctx context.Context, order *domain.Order) error {
	dbOrder := persistence.Order{
		Model:       gorm.Model{ID: order.ID},
		UserID:      order.UserID,
		TotalAmount: order.TotalAmount,
		Status:      string(order.Status),
	}

	return r.db.WithContext(ctx).Save(&dbOrder).Error
}

func (r *orderRepository) UpdateStatus(ctx context.Context, id uint, status domain.OrderStatus) error {
	return r.db.WithContext(ctx).Model(&persistence.Order{}).
		Where("id = ?", id).
		Update("status", status).Error
}
