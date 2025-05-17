package http

import (
	"time"

	"github.com/smart-hostel/backend/internal/user-service/domain"
)

type CreateUserDTO struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Phone    string `json:"phone" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
	Role     string `json:"role" binding:"omitempty,oneof=admin guest"`
}

type UpdateUserDTO struct {
	Username string `json:"username,omitempty"`
	Email    string `json:"email,omitempty" binding:"omitempty,email"`
	Phone    string `json:"phone,omitempty"`
	Password string `json:"password,omitempty" binding:"omitempty,min=8"`
	Role     string `json:"role,omitempty" binding:"omitempty,oneof=admin guest"`
}

type UserResponseDTO struct {
	ID        uint      `json:"id"`
	Username  string    `json:"username"`
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
	role := domain.Guest
	if dto.Role == string(domain.Admin) {
		role = domain.Admin
	}
	return domain.User{
		Username: dto.Username,
		Email:    dto.Email,
		Phone:    dto.Phone,
		Password: dto.Password,
		Role:     role,
	}
}

func (dto *UpdateUserDTO) ToDomain() domain.User {
	role := domain.Guest
	if dto.Role == string(domain.Admin) {
		role = domain.Admin
	}
	return domain.User{
		Username: dto.Username,
		Email:    dto.Email,
		Phone:    dto.Phone,
		Password: dto.Password,
		Role:     role,
	}
}

func FromDomain(user domain.User) UserResponseDTO {
	return UserResponseDTO{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
		Phone:    user.Phone,
		Role:     string(user.Role),
	}
}
