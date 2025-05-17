import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Lightbulb as LightIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { getRooms, updateRoom, deleteRoom } from "../services/roomService";

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedRoom, setEditedRoom] = useState(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error("Error loading rooms:", error);
    }
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setEditedRoom({ ...room });
    setIsDialogOpen(true);
  };

  const handleSaveRoom = async () => {
    try {
      await updateRoom(editedRoom.id, editedRoom);
      await loadRooms();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту комнату?")) {
      try {
        await deleteRoom(roomId);
        await loadRooms();
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
  };

  const handleToggleLight = async (roomId, currentState) => {
    try {
      await updateRoom(roomId, { isLightOn: !currentState });
      await loadRooms();
    } catch (error) {
      console.error("Error toggling light:", error);
    }
  };

  const handleToggleDoor = async (roomId, currentState) => {
    try {
      await updateRoom(roomId, { isDoorLocked: !currentState });
      await loadRooms();
    } catch (error) {
      console.error("Error toggling door:", error);
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.number.toString().includes(searchQuery) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Управление комнатами
      </Typography>

      <TextField
        fullWidth
        label="Поиск комнат"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Номер</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Температура</TableCell>
              <TableCell>Влажность</TableCell>
              <TableCell>Давление</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.number}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>{room.isOccupied ? "Занята" : "Свободна"}</TableCell>
                <TableCell>{room.temperature}°C</TableCell>
                <TableCell>{room.humidity}%</TableCell>
                <TableCell>{room.pressure} мм рт.ст.</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditRoom(room)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteRoom(room.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      /* Добавить гостя */
                    }}
                  >
                    <PersonAddIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleToggleLight(room.id, room.isLightOn)}
                  >
                    <LightIcon color={room.isLightOn ? "primary" : "inherit"} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleToggleDoor(room.id, room.isDoorLocked)}
                  >
                    <LockIcon
                      color={room.isDoorLocked ? "primary" : "inherit"}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Редактировать комнату</DialogTitle>
        <DialogContent>
          {editedRoom && (
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Номер"
                value={editedRoom.number}
                onChange={(e) =>
                  setEditedRoom({ ...editedRoom, number: e.target.value })
                }
              />
              <TextField
                label="Тип"
                value={editedRoom.type}
                onChange={(e) =>
                  setEditedRoom({ ...editedRoom, type: e.target.value })
                }
              />
              <TextField
                label="Температура"
                type="number"
                value={editedRoom.temperature}
                onChange={(e) =>
                  setEditedRoom({ ...editedRoom, temperature: e.target.value })
                }
              />
              <TextField
                label="Влажность"
                type="number"
                value={editedRoom.humidity}
                onChange={(e) =>
                  setEditedRoom({ ...editedRoom, humidity: e.target.value })
                }
              />
              <TextField
                label="Давление"
                type="number"
                value={editedRoom.pressure}
                onChange={(e) =>
                  setEditedRoom({ ...editedRoom, pressure: e.target.value })
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editedRoom.isOccupied}
                    onChange={(e) =>
                      setEditedRoom({
                        ...editedRoom,
                        isOccupied: e.target.checked,
                      })
                    }
                  />
                }
                label="Занята"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSaveRoom} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminRooms;
