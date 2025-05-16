package main

import (
	"log"

	"user-service/internal/database"
	"user-service/internal/delivery/grpc"
	"user-service/internal/delivery/http"
	"user-service/internal/repositories"
	"user-service/internal/services"
)

func main() {
	db, err := database.InitDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	userRepo := repositories.NewUserRepository(db)

	userService := services.NewUserService(userRepo)

	go func() {
		httpServer := http.NewHTTPServer(userService)
		log.Println("HTTP server starting on :8080")
		if err := httpServer.Start("8080"); err != nil {
			log.Fatalf("HTTP server failed: %v", err)
		}
	}()

	go func() {
		grpcServer := grpc.NewGRPCServer(userService)
		log.Println("gRPC server starting on :8081")
		if err := grpcServer.Start("8081"); err != nil {
			log.Fatalf("gRPC server failed: %v", err)
		}
	}()

	select {}
}
