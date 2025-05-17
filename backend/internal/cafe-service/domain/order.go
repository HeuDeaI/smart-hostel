package domain

import (
	"errors"
	"time"
)

type OrderStatus string

const (
	Pending   OrderStatus = "pending"
	Preparing OrderStatus = "preparing"
	Ready     OrderStatus = "ready"
	Completed OrderStatus = "completed"
	Cancelled OrderStatus = "cancelled"
)

type OrderItem struct {
	MenuItemID uint
	Quantity   int
	Price      float64
}

type Order struct {
	ID          uint
	UserID      uint
	Items       []OrderItem
	TotalAmount float64
	Status      OrderStatus
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func (o *Order) Validate() error {
	if o.UserID == 0 {
		return errors.New("user ID cannot be empty")
	}

	if len(o.Items) == 0 {
		return errors.New("order must contain at least one item")
	}

	for _, item := range o.Items {
		if item.MenuItemID == 0 {
			return errors.New("menu item ID cannot be empty")
		}
		if item.Quantity <= 0 {
			return errors.New("quantity must be greater than 0")
		}
		if item.Price <= 0 {
			return errors.New("price must be greater than 0")
		}
	}

	if o.Status == "" {
		o.Status = Pending
	} else if o.Status != Pending && o.Status != Preparing && o.Status != Ready && o.Status != Completed && o.Status != Cancelled {
		return errors.New("invalid order status")
	}

	return nil
}
