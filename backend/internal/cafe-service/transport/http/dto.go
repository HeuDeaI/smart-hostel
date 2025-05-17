package http

import (
	"time"

	"github.com/smart-hostel/backend/internal/cafe-service/domain"
)

type MenuItemResponseDTO struct {
	ID          uint    `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Category    string  `json:"category"`
	ImageURL    string  `json:"image_url"`
	IsAvailable bool    `json:"is_available"`
}

func FromDomainMenuItem(item *domain.MenuItem) MenuItemResponseDTO {
	return MenuItemResponseDTO{
		ID:          item.ID,
		Name:        item.Name,
		Description: item.Description,
		Price:       item.Price,
		Category:    string(item.Category),
		ImageURL:    item.ImageURL,
		IsAvailable: item.IsAvailable,
	}
}

type CreateOrderDTO struct {
	UserID uint `json:"user_id" binding:"required"`
	Items  []struct {
		MenuItemID uint    `json:"menu_item_id" binding:"required"`
		Quantity   int     `json:"quantity" binding:"required,min=1"`
		Price      float64 `json:"price" binding:"required,min=0"`
	} `json:"items" binding:"required,min=1"`
}

func (dto *CreateOrderDTO) ToDomain() domain.Order {
	var items []domain.OrderItem
	var totalAmount float64

	for _, item := range dto.Items {
		items = append(items, domain.OrderItem{
			MenuItemID: item.MenuItemID,
			Quantity:   item.Quantity,
			Price:      item.Price,
		})
		totalAmount += item.Price * float64(item.Quantity)
	}

	return domain.Order{
		UserID:      dto.UserID,
		Items:       items,
		TotalAmount: totalAmount,
		Status:      domain.Pending,
	}
}

type OrderResponseDTO struct {
	ID          uint                   `json:"id"`
	UserID      uint                   `json:"user_id"`
	Items       []OrderItemResponseDTO `json:"items"`
	TotalAmount float64                `json:"total_amount"`
	Status      string                 `json:"status"`
	CreatedAt   time.Time              `json:"created_at"`
	UpdatedAt   time.Time              `json:"updated_at"`
}

type OrderItemResponseDTO struct {
	MenuItemID uint    `json:"menu_item_id"`
	Quantity   int     `json:"quantity"`
	Price      float64 `json:"price"`
}

func FromDomainOrder(order *domain.Order) OrderResponseDTO {
	var items []OrderItemResponseDTO
	for _, item := range order.Items {
		items = append(items, OrderItemResponseDTO{
			MenuItemID: item.MenuItemID,
			Quantity:   item.Quantity,
			Price:      item.Price,
		})
	}

	return OrderResponseDTO{
		ID:          order.ID,
		UserID:      order.UserID,
		Items:       items,
		TotalAmount: order.TotalAmount,
		Status:      string(order.Status),
		CreatedAt:   order.CreatedAt,
		UpdatedAt:   order.UpdatedAt,
	}
}

type ErrorResponse struct {
	Error string `json:"error"`
}
