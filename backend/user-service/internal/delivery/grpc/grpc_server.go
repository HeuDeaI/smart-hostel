package grpc

import (
	"context"
	"log"
	"net"

	"user-service/internal/models"
	"user-service/internal/pb"
	"user-service/internal/services"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
)

type GRPCServer struct {
	userService services.UserService
	grpcServer  *grpc.Server
	pb.UnimplementedUserServiceServer
}

func NewGRPCServer(userService services.UserService) *GRPCServer {
	server := &GRPCServer{
		userService: userService,
		grpcServer:  grpc.NewServer(),
	}

	pb.RegisterUserServiceServer(server.grpcServer, server)

	return server
}

func (s *GRPCServer) Start(port string) error {
	lis, err := net.Listen("tcp", ":"+port)
	if err != nil {
		return err
	}

	log.Printf("gRPC server starting on port %s\n", port)
	return s.grpcServer.Serve(lis)
}

func (s *GRPCServer) CreateUser(ctx context.Context, req *pb.CreateUserRequest) (*pb.UserResponse, error) {
	user := &models.User{
		Username: req.GetUsername(),
		Email:    req.GetEmail(),
		Phone:    req.GetPhone(),
	}
	err := s.userService.CreateUser(user)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to create user")
	}

	return &pb.UserResponse{
		Id:       uint32(user.ID),
		Username: user.Username,
		Email:    user.Email,
		Phone:    user.Phone,
	}, nil
}

func (s *GRPCServer) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.UserResponse, error) {
	user, err := s.userService.GetUserByID(uint(req.GetId()))
	if err != nil {
		return nil, status.Error(codes.NotFound, "user not found")
	}

	return &pb.UserResponse{
		Id:       uint32(user.ID),
		Username: user.Username,
		Email:    user.Email,
		Phone:    user.Phone,
	}, nil
}

func (s *GRPCServer) GetAllUsers(ctx context.Context, req *pb.GetAllUsersRequest) (*pb.GetAllUsersResponse, error) {
	users, err := s.userService.GetAllUsers()
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to retrieve users")
	}

	var userResponses []*pb.UserResponse
	for _, user := range users {
		userResponses = append(userResponses, &pb.UserResponse{
			Id:       uint32(user.ID),
			Username: user.Username,
			Email:    user.Email,
			Phone:    user.Phone,
		})
	}

	return &pb.GetAllUsersResponse{Users: userResponses}, nil
}

func (s *GRPCServer) UpdateUser(ctx context.Context, req *pb.UpdateUserRequest) (*pb.UserResponse, error) {
	user := &models.User{
		Model:    gorm.Model{ID: uint(req.GetId())},
		Username: req.GetUsername(),
		Email:    req.GetEmail(),
		Phone:    req.GetPhone(),
	}
	err := s.userService.UpdateUser(user)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to update user")
	}

	return &pb.UserResponse{
		Id:       uint32(user.ID),
		Username: user.Username,
		Email:    user.Email,
		Phone:    user.Phone,
	}, nil
}

func (s *GRPCServer) DeleteUser(ctx context.Context, req *pb.DeleteUserRequest) (*pb.DeleteUserResponse, error) {
	err := s.userService.DeleteUser(uint(req.GetId()))
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to delete user")
	}

	return &pb.DeleteUserResponse{Success: true}, nil
}
