package domain

import (
	"errors"
)

type MenuCategory string

const (
	Breakfast MenuCategory = "breakfast"
	Lunch     MenuCategory = "lunch"
	Dinner    MenuCategory = "dinner"
	Drinks    MenuCategory = "drinks"
	Snacks    MenuCategory = "snacks"
)

type MenuItem struct {
	ID          uint
	Name        string
	Description string
	Price       float64
	Category    MenuCategory
	ImageURL    string
	IsAvailable bool
}

func (m *MenuItem) Validate() error {
	if m.Name == "" {
		return errors.New("name cannot be empty")
	}

	if m.Category == "" {
		return errors.New("category cannot be empty")
	} else if m.Category != Breakfast && m.Category != Lunch && m.Category != Dinner && m.Category != Drinks && m.Category != Snacks {
		return errors.New("invalid category")
	}

	if m.Price <= 0 {
		return errors.New("price must be greater than 0")
	}

	return nil
}

func SeedMenuItems() []MenuItem {
	return []MenuItem{
		{
			Name:        "Continental Breakfast",
			Description: "Fresh fruits, pastries, coffee, and juice",
			Price:       15.00,
			Category:    Breakfast,
			ImageURL:    "/images/breakfast/continental.jpg",
			IsAvailable: true,
		},
		{
			Name:        "Full English Breakfast",
			Description: "Eggs, bacon, sausage, beans, mushrooms, and toast",
			Price:       20.00,
			Category:    Breakfast,
			ImageURL:    "/images/breakfast/english.jpg",
			IsAvailable: true,
		},
		{
			Name:        "Caesar Salad",
			Description: "Fresh romaine lettuce, croutons, parmesan cheese with Caesar dressing",
			Price:       12.00,
			Category:    Lunch,
			ImageURL:    "/images/lunch/caesar.jpg",
			IsAvailable: true,
		},
		{
			Name:        "Club Sandwich",
			Description: "Triple-decker sandwich with chicken, bacon, lettuce, and tomato",
			Price:       14.00,
			Category:    Lunch,
			ImageURL:    "/images/lunch/club.jpg",
			IsAvailable: true,
		},
		{
			Name:        "Grilled Salmon",
			Description: "Fresh salmon fillet with seasonal vegetables and lemon butter sauce",
			Price:       25.00,
			Category:    Dinner,
			ImageURL:    "/images/dinner/salmon.jpg",
			IsAvailable: true,
		},
		{
			Name:        "Beef Steak",
			Description: "Premium beef steak with mashed potatoes and grilled vegetables",
			Price:       30.00,
			Category:    Dinner,
			ImageURL:    "/images/dinner/steak.jpg",
			IsAvailable: true,
		},
		{
			Name:        "Fresh Orange Juice",
			Description: "Freshly squeezed orange juice",
			Price:       5.00,
			Category:    Drinks,
			ImageURL:    "/images/drinks/orange.jpg",
			IsAvailable: true,
		},
		{
			Name:        "Cappuccino",
			Description: "Espresso with steamed milk and foam",
			Price:       4.00,
			Category:    Drinks,
			ImageURL:    "/images/drinks/cappuccino.jpg",
			IsAvailable: true,
		},
		{
			Name:        "French Fries",
			Description: "Crispy golden fries with ketchup",
			Price:       6.00,
			Category:    Snacks,
			ImageURL:    "/images/snacks/fries.jpg",
			IsAvailable: true,
		},
		{
			Name:        "Chocolate Cake",
			Description: "Rich chocolate cake with chocolate ganache",
			Price:       8.00,
			Category:    Snacks,
			ImageURL:    "/images/snacks/cake.jpg",
			IsAvailable: true,
		},
	}
}
