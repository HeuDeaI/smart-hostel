package security

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/smart-hostel/backend/internal/platform/auth"
)

func GenerateToken(userID uint, role string, expiresAt int64, secretKey string) (string, error) {
	claims := &auth.Claims{
		UserID: fmt.Sprintf("%d", userID),
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Unix(expiresAt, 0)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secretKey))
}

func ParseToken(tokenString string, secretKey string) (*auth.Claims, error) {
	return auth.ValidateToken(tokenString, secretKey)
}
