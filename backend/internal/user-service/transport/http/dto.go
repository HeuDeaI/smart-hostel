package http

import (
	"time"

	"github.com/smart-hostel/backend/internal/user-service/domain"
)

type CreateUserDTO struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Phone     string `json:"phone" binding:"required"`
	Password  string `json:"password" binding:"required,min=8"`
	Role      string `json:"role" binding:"required,oneof=admin guest"`
}

type UpdateUserDTO struct {
	FirstName string `json:"firstName,omitempty"`
	LastName  string `json:"lastName,omitempty"`
	Email     string `json:"email,omitempty" binding:"omitempty,email"`
	Phone     string `json:"phone,omitempty"`
	Password  string `json:"password,omitempty" binding:"omitempty,min=8"`
	Role      string `json:"role,omitempty" binding:"omitempty,oneof=admin guest"`
}

type UserResponseDTO struct {
	ID        uint      `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

func (dto *CreateUserDTO) ToDomain() domain.User {
	return domain.User{
		FirstName: dto.FirstName,
		LastName:  dto.LastName,
		Email:     dto.Email,
		Phone:     dto.Phone,
		Password:  dto.Password,
		Role:      domain.Role(dto.Role),
	}
}

func (dto *UpdateUserDTO) ToDomain() domain.User {
	return domain.User{
		FirstName: dto.FirstName,
		LastName:  dto.LastName,
		Email:     dto.Email,
		Phone:     dto.Phone,
		Password:  dto.Password,
		Role:      domain.Role(dto.Role),
	}
}

func FromDomain(user domain.User) UserResponseDTO {
	return UserResponseDTO{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
		Phone:     user.Phone,
		Role:      string(user.Role),
	}
}
