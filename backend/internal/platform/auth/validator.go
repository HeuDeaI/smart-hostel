package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func ValidateToken(tokenString, secret string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(
		tokenString,
		&Claims{},
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secret), nil
		},
	)

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		if time.Now().After(claims.ExpiresAt.Time) {
			return nil, fmt.Errorf("token expired")
		}
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token")
}
