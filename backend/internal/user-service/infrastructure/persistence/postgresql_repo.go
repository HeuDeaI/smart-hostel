package persistence

import (
	"context"
	"github.com/smart-hostel/backend/internal/user-service/domain"

	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) domain.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *domain.User) error {
	userModel := fromDomainUser(user)
	result := r.db.WithContext(ctx).Create(userModel)
	if result.Error != nil {
		return result.Error
	}
	*user = *toDomainUser(userModel)
	return nil
}

func (r *userRepository) FindByID(ctx context.Context, id uint) (*domain.User, error) {
	var user User
	result := r.db.WithContext(ctx).First(&user, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return toDomainUser(&user), nil
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	var user User
	result := r.db.WithContext(ctx).Where("email = ?", email).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return toDomainUser(&user), nil
}

func (r *userRepository) FindAll(ctx context.Context) ([]domain.User, error) {
	var users []User
	result := r.db.WithContext(ctx).Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}

	domainUsers := make([]domain.User, len(users))
	for i, user := range users {
		domainUser := toDomainUser(&user)
		domainUsers[i] = *domainUser
	}
	return domainUsers, nil
}

func (r *userRepository) ExistsByEmail(ctx context.Context, email string) (bool, error) {
	var count int64
	result := r.db.WithContext(ctx).Model(&User{}).Where("email = ?", email).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

func (r *userRepository) Update(ctx context.Context, user *domain.User) error {
	userModel := fromDomainUser(user)
	result := r.db.WithContext(ctx).Save(userModel)
	if result.Error != nil {
		return result.Error
	}
	*user = *toDomainUser(userModel)
	return nil
}

func (r *userRepository) Delete(ctx context.Context, id uint) error {
	result := r.db.WithContext(ctx).Delete(&User{}, id)
	return result.Error
}
