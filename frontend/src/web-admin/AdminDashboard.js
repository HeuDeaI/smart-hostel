import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  MeetingRoom as RoomIcon,
} from "@mui/icons-material";
import { getRooms } from "../services/roomService";
import { getGuests } from "../services/guestService";

const AdminDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalGuests: 0,
    availableRooms: 0,
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadRooms();
    loadStats();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error("Error loading rooms:", error);
    }
  };

  const loadStats = async () => {
    try {
      const rooms = await getRooms();
      const guests = await getGuests();

      setStats({
        totalRooms: rooms.length,
        occupiedRooms: rooms.filter((room) => room.isOccupied).length,
        totalGuests: guests.length,
        availableRooms: rooms.filter((room) => !room.isOccupied).length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (filter === "all") return true;
    if (filter === "occupied") return room.isOccupied;
    if (filter === "free") return !room.isOccupied;
    return true;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Общая информация */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Всего комнат</Typography>
            <Typography variant="h4">{stats.totalRooms}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Занято комнат</Typography>
            <Typography variant="h4">{stats.occupiedRooms}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Всего гостей</Typography>
            <Typography variant="h4">{stats.totalGuests}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Свободно комнат</Typography>
            <Typography variant="h4">{stats.availableRooms}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Быстрые действия */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            /* Добавить комнату */
          }}
        >
          Добавить комнату
        </Button>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => {
            /* Добавить гостя */
          }}
        >
          Добавить гостя
        </Button>
      </Box>

      {/* Фильтры */}
      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Фильтр комнат"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Все комнаты</MenuItem>
          <MenuItem value="occupied">Занятые</MenuItem>
          <MenuItem value="free">Свободные</MenuItem>
        </TextField>
      </Box>

      {/* Список комнат */}
      <Grid container spacing={3}>
        {filteredRooms.map((room) => (
          <Grid item xs={12} md={4} key={room.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Комната {room.number}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography>
                    Статус: {room.isOccupied ? "Занята" : "Свободна"}
                  </Typography>
                  <Typography>
                    Дверь: {room.isDoorLocked ? "Закрыта" : "Открыта"}
                  </Typography>
                  <Typography>
                    Свет: {room.isLightOn ? "Включен" : "Выключен"}
                  </Typography>
                  <Typography>Гости: {room.currentGuests}</Typography>
                  <Typography>Температура: {room.temperature}°C</Typography>
                  <Typography>Влажность: {room.humidity}%</Typography>
                  <Typography>Давление: {room.pressure} мм рт.ст.</Typography>
                </Box>
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      /* Заселить */
                    }}
                  >
                    Заселить
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => {
                      /* Включить/выключить свет */
                    }}
                  >
                    <RoomIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
