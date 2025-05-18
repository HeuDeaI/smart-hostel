package http

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	admindomain "github.com/smart-hostel/backend/internal/admin-service/domain"
	bookingdomain "github.com/smart-hostel/backend/internal/booking-service/domain"
	userdomain "github.com/smart-hostel/backend/internal/user-service/domain"
)

type Handler struct {
	adminService admindomain.AdminService
}

func NewHandler(adminService admindomain.AdminService) *Handler {
	return &Handler{
		adminService: adminService,
	}
}

func (h *Handler) RegisterRoutes(r *gin.Engine) {
	admin := r.Group("/admin")
	{
		admin.GET("/dashboard", h.GetDashboard)
		admin.GET("/stats", h.GetStats)
		admin.GET("/users", h.GetAllUsers)
		admin.GET("/bookings", h.GetAllBookings)
		admin.GET("/rooms", h.GetAllRooms)
		admin.PUT("/users/:id/role", h.UpdateUserRole)
		admin.DELETE("/users/:id", h.DeleteUser)
		admin.DELETE("/bookings/:id", h.DeleteBooking)

		admin.POST("/users", h.CreateUser)
		admin.POST("/bookings", h.CreateBooking)
	}
}

func (h *Handler) GetDashboard(c *gin.Context) {
	dashboard, err := h.adminService.GetDashboard(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dashboard)
}

func (h *Handler) GetStats(c *gin.Context) {
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	start, err := time.Parse("2006-01-02", startDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start date format"})
		return
	}

	end, err := time.Parse("2006-01-02", endDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end date format"})
		return
	}

	stats, err := h.adminService.GetStats(c, start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func (h *Handler) GetAllUsers(c *gin.Context) {
	users, err := h.adminService.GetAllUsers(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}

func (h *Handler) GetAllBookings(c *gin.Context) {
	bookings, err := h.adminService.GetAllBookings(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, bookings)
}

func (h *Handler) GetAllRooms(c *gin.Context) {
	rooms, err := h.adminService.GetAllRooms(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, rooms)
}

func (h *Handler) UpdateUserRole(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	var request struct {
		Role userdomain.Role `json:"role"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.adminService.UpdateUserRole(c, uint(userID), request.Role); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}

func (h *Handler) DeleteUser(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	if err := h.adminService.DeleteUser(c, uint(userID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}

func (h *Handler) DeleteBooking(c *gin.Context) {
	bookingID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid booking ID"})
		return
	}

	if err := h.adminService.DeleteBooking(c, uint(bookingID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}

func (h *Handler) CreateUser(c *gin.Context) {
	var user userdomain.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	created, err := h.adminService.CreateUser(c, &user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, created)
}

func (h *Handler) CreateBooking(c *gin.Context) {
	var booking bookingdomain.Booking
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.adminService.CreateBooking(c, &booking); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusCreated)
}
