package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string `gorm:"unique,not null" json:"username"`
	Password string `gorm:"unique,not null" json:"password"`
	Email    string `gorm:"unique,not null" json:"email"`
	Phone    string `gorm:"unique,not null" json:"phone"`
	Role     string `gorm:"not null" json:"role"`
}
