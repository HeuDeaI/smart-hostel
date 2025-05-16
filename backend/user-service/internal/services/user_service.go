package services

import (
	"user-service/internal/models"
	"user-service/internal/repositories"
)

type UserService interface {
	CreateUser(user *models.User) error
	GetUserByID(id uint) (*models.User, error)
	GetAllUsers() ([]models.User, error)
	UpdateUser(user *models.User) error
	DeleteUser(id uint) error
}

type userService struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) CreateUser(user *models.User) error {
	return s.repo.CreateUser(user)
}

func (s *userService) GetUserByID(id uint) (*models.User, error) {
	return s.repo.GetUserByID(id)
}

func (s *userService) GetAllUsers() ([]models.User, error) {
	return s.repo.GetAllUsers()
}

func (s *userService) UpdateUser(user *models.User) error {
	return s.repo.UpdateUser(user)
}

func (s *userService) DeleteUser(id uint) error {
	return s.repo.DeleteUser(id)
}
