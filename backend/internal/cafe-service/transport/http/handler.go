package http

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/smart-hostel/backend/internal/cafe-service/domain"
)

type CafeHandler struct {
	cafeService domain.CafeService
}

func NewCafeHandler(cafeService domain.CafeService) *CafeHandler {
	return &CafeHandler{cafeService: cafeService}
}

func (h *CafeHandler) SeedMenuItems(c *gin.Context) {
	if err := h.cafeService.SeedMenuItems(c.Request.Context()); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.Status(http.StatusCreated)
}

func (h *CafeHandler) GetMenuItem(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid menu item ID"})
		return
	}

	item, err := h.cafeService.GetMenuItem(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: "Menu item not found"})
		return
	}

	c.JSON(http.StatusOK, FromDomainMenuItem(item))
}

func (h *CafeHandler) GetAllMenuItems(c *gin.Context) {
	items, err := h.cafeService.GetAllMenuItems(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	response := make([]MenuItemResponseDTO, len(items))
	for i, item := range items {
		response[i] = FromDomainMenuItem(item)
	}

	c.JSON(http.StatusOK, response)
}

func (h *CafeHandler) GetMenuItemsByCategory(c *gin.Context) {
	category := domain.MenuCategory(c.Query("category"))
	if category == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Category is required"})
		return
	}

	items, err := h.cafeService.GetMenuItemsByCategory(c.Request.Context(), category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	response := make([]MenuItemResponseDTO, len(items))
	for i, item := range items {
		response[i] = FromDomainMenuItem(item)
	}

	c.JSON(http.StatusOK, response)
}

func (h *CafeHandler) CreateOrder(c *gin.Context) {
	var createDTO CreateOrderDTO
	if err := c.ShouldBindJSON(&createDTO); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	order := createDTO.ToDomain()
	if err := h.cafeService.CreateOrder(c.Request.Context(), &order); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, FromDomainOrder(&order))
}

func (h *CafeHandler) GetOrder(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid order ID"})
		return
	}

	order, err := h.cafeService.GetOrder(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: "Order not found"})
		return
	}

	c.JSON(http.StatusOK, FromDomainOrder(order))
}

func (h *CafeHandler) GetUserOrders(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("user_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid user ID"})
		return
	}

	orders, err := h.cafeService.GetUserOrders(c.Request.Context(), uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	response := make([]OrderResponseDTO, len(orders))
	for i, order := range orders {
		response[i] = FromDomainOrder(order)
	}

	c.JSON(http.StatusOK, response)
}

func (h *CafeHandler) UpdateOrderStatus(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid order ID"})
		return
	}

	var request struct {
		Status domain.OrderStatus `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	if err := h.cafeService.UpdateOrderStatus(c.Request.Context(), uint(id), request.Status); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.Status(http.StatusOK)
}
