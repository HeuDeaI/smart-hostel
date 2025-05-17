package auth

import (
	"errors"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

const userKey = "userClaims"

func GinJWTMiddleware(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := extractToken(c)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorized",
				"msg":   err.Error(),
			})
			return
		}

		claims, err := ValidateToken(tokenString, secret)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorized",
				"msg":   "Invalid token",
			})
			return
		}

		c.Set(userKey, claims)
		c.Next()
	}
}

func extractToken(c *gin.Context) (string, error) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return "", errors.New("authorization header required")
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return "", errors.New("invalid authorization header format")
	}

	return parts[1], nil
}

func GetUserClaims(c *gin.Context) *Claims {
	val, exists := c.Get(userKey)
	if !exists {
		return nil
	}

	claims, ok := val.(*Claims)
	if !ok {
		return nil
	}

	return claims
}
