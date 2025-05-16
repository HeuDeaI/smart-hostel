package models

type Room struct {
	ID     uint `gorm:"primaryKey" json:"id"`
	Number int  `gorm:"unique;not null" json:"number"`
}
