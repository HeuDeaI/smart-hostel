package domain

import (
	"errors"
	"regexp"
)

type Role string

const (
	Admin Role = "admin"
	Guest Role = "guest"
)

type User struct {
	ID        uint
	FirstName string
	LastName  string
	Email     string
	Phone     string
	Password  string
	Role      Role
}

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
var phoneRegex = regexp.MustCompile(`^\+?[0-9]{10,15}$`)

func (u *User) Validate() error {
	if u.FirstName == "" || u.LastName == "" {
		return errors.New("first name and last name cannot be empty")
	}

	if !emailRegex.MatchString(u.Email) {
		return errors.New("invalid email format")
	}

	if !phoneRegex.MatchString(u.Phone) {
		return errors.New("invalid phone number format")
	}

	if len(u.Password) < 8 {
		return errors.New("password must be at least 8 characters long")
	}

	if u.Role != Admin && u.Role != Guest {
		return errors.New("invalid role")
	}

	return nil
}
