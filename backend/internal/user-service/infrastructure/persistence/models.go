package persistence

import (
	"github.com/smart-hostel/backend/internal/user-service/domain"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName string `gorm:"not null"`
	LastName  string `gorm:"not null"`
	Email     string `gorm:"unique;not null"`
	Phone     string `gorm:"unique;not null"`
	Password  string `gorm:"not null"`
	Role      string `gorm:"not null;default:'guest'"`
}

func toDomainUser(u *User) *domain.User {
	return &domain.User{
		ID:        u.ID,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Email:     u.Email,
		Phone:     u.Phone,
		Password:  u.Password,
		Role:      domain.Role(u.Role),
	}
}

func fromDomainUser(u *domain.User) *User {
	return &User{
		Model:     gorm.Model{ID: u.ID},
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Email:     u.Email,
		Phone:     u.Phone,
		Password:  u.Password,
		Role:      string(u.Role),
	}
}
