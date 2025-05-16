package main

import (
	"log"

	"room-service/internal/database"
	"room-service/internal/delivery/grpc"
	"room-service/internal/delivery/http"
	"room-service/internal/repositories"
	"room-service/internal/services"
)

func main() {
	db, err := database.InitDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	roomRepo := repositories.NewRoomRepository(db)
	if err := roomRepo.SeedRooms(); err != nil {
		log.Fatalf("Failed to seed rooms: %v", err)
	}

	roomService := services.NewRoomService(roomRepo)

	go func() {
		httpServer := http.NewHTTPServer(roomService)
		log.Println("HTTP server starting on :8080")
		if err := httpServer.Start("8080"); err != nil {
			log.Fatalf("HTTP server failed: %v", err)
		}
	}()

	go func() {
		grpcServer := grpc.NewGRPCServer(roomService)
		log.Println("gRPC server starting on :8081")
		if err := grpcServer.Start("8081"); err != nil {
			log.Fatalf("gRPC server failed: %v", err)
		}
	}()

	select {}
}
