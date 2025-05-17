package persistence

import (
	"gorm.io/gorm"
)

type MenuItem struct {
	gorm.Model
	Name        string `gorm:"type:varchar(100);not null"`
	Description string `gorm:"type:text"`
	Price       float64
	Category    string `gorm:"type:varchar(20);not null"`
	ImageURL    string `gorm:"type:varchar(255)"`
	IsAvailable bool   `gorm:"default:true"`
}

type OrderItem struct {
	gorm.Model
	OrderID    uint
	MenuItemID uint
	Quantity   int
	Price      float64
}

type Order struct {
	gorm.Model
	UserID      uint
	Items       []OrderItem
	TotalAmount float64
	Status      string `gorm:"type:varchar(20);not null"`
}
