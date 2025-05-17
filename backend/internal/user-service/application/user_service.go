package application

import (
	"context"
	"errors"
	"time"

	"github.com/smart-hostel/backend/internal/user-service/domain"
	"github.com/smart-hostel/backend/internal/user-service/infrastructure/security"

	"golang.org/x/crypto/bcrypt"
)

type userService struct {
	userRepo  domain.UserRepository
	secretKey string
}

func NewUserService(repo domain.UserRepository, secretKey string) domain.UserService {
	return &userService{userRepo: repo, secretKey: secretKey}
}

func (s *userService) RegisterUser(ctx context.Context, user *domain.User) (*domain.User, error) {
	exists, err := s.userRepo.ExistsByEmail(ctx, user.Email)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("user with this email already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user.Password = string(hashedPassword)

	return s.userRepo.Create(ctx, user)
}

func (s *userService) GetUserByID(ctx context.Context, id uint) (*domain.User, error) {
	return s.userRepo.FindByID(ctx, id)
}

func (s *userService) GetUserByEmail(ctx context.Context, email string) (*domain.User, error) {
	return s.userRepo.FindByEmail(ctx, email)
}

func (s *userService) GetAllUsers(ctx context.Context) ([]domain.User, error) {
	return s.userRepo.FindAll(ctx)
}

func (s *userService) UpdateUser(ctx context.Context, user *domain.User) (*domain.User, error) {
	return s.userRepo.Update(ctx, user)
}

func (s *userService) DeleteUser(ctx context.Context, id uint) error {
	return s.userRepo.Delete(ctx, id)
}

func (s *userService) Login(ctx context.Context, email, password string) (*domain.User, string, error) {
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	expiresAt := time.Now().Add(time.Hour * 24).Unix()
	token, err := security.GenerateToken(user.ID, string(user.Role), expiresAt, s.secretKey)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}
