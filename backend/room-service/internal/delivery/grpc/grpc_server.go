package grpc

import (
	"context"
	"log"
	"net"

	"room-service/internal/pb"
	"room-service/internal/services"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type GRPCServer struct {
	roomService services.RoomService
	grpcServer  *grpc.Server
	pb.UnimplementedRoomServiceServer
}

func NewGRPCServer(roomService services.RoomService) *GRPCServer {
	server := &GRPCServer{
		roomService: roomService,
		grpcServer:  grpc.NewServer(),
	}

	pb.RegisterRoomServiceServer(server.grpcServer, server)

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

func (s *GRPCServer) GetRooms(ctx context.Context, req *pb.GetRoomsRequest) (*pb.GetRoomsResponse, error) {
	rooms, err := s.roomService.GetRooms(req.GetAvailable())
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to get rooms")
	}

	pbRooms := make([]*pb.Room, len(rooms))
	for i, r := range rooms {
		pbRooms[i] = &pb.Room{
			Id:     uint64(r.ID),
			Number: int64(r.Number),
		}
	}

	return &pb.GetRoomsResponse{Rooms: pbRooms}, nil
}

func (s *GRPCServer) BookRoom(ctx context.Context, req *pb.BookRoomRequest) (*pb.BookRoomResponse, error) {
	err := s.roomService.BookRoom(int(req.GetNumber()))
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to book room")
	}
	return &pb.BookRoomResponse{}, nil
}

func (s *GRPCServer) ReleaseRoom(ctx context.Context, req *pb.ReleaseRoomRequest) (*pb.ReleaseRoomResponse, error) {
	err := s.roomService.ReleaseRoom(int(req.GetNumber()))
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to release room")
	}
	return &pb.ReleaseRoomResponse{}, nil
}
