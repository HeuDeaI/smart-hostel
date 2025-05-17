package persistence

import (
	"github.com/smart-hostel/backend/internal/user-service/domain"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `gorm:"not null"`
	Email    string `gorm:"unique;not null"`
	Phone    string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
	Role     string `gorm:"not null;default:'guest'"`
}

func toDomainUser(u *User) *domain.User {
	role := domain.Guest
	if u.Role == string(domain.Admin) {
		role = domain.Admin
	}
	return &domain.User{
		ID:       u.ID,
		Username: u.Username,
		Email:    u.Email,
		Phone:    u.Phone,
		Password: u.Password,
		Role:     role,
	}
}

func fromDomainUser(u *domain.User) *User {
	role := string(domain.Guest)
	if u.Role == domain.Admin {
		role = string(domain.Admin)
	}
	return &User{
		Model:    gorm.Model{ID: u.ID},
		Username: u.Username,
		Email:    u.Email,
		Phone:    u.Phone,
		Password: u.Password,
		Role:     role,
	}
}
