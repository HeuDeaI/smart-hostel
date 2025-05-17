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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { getGuests, updateGuest } from "../services/guestService";

const AdminGuests = () => {
  const [guests, setGuests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedGuest, setEditedGuest] = useState(null);

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      const response = await getGuests();
      setGuests(response.data);
    } catch (error) {
      console.error("Error loading guests:", error);
    }
  };

  const handleEditGuest = (guest) => {
    setSelectedGuest(guest);
    setEditedGuest({ ...guest });
    setIsDialogOpen(true);
  };

  const handleSaveGuest = async () => {
    try {
      await updateGuest(editedGuest.id, editedGuest);
      await loadGuests();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating guest:", error);
    }
  };

  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone.includes(searchQuery)
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Управление гостями
      </Typography>

      <TextField
        fullWidth
        label="Поиск гостей"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Комната</TableCell>
              <TableCell>Заезд</TableCell>
              <TableCell>Выезд</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGuests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>{guest.name}</TableCell>
                <TableCell>{guest.email}</TableCell>
                <TableCell>{guest.phone}</TableCell>
                <TableCell>{guest.roomNumber}</TableCell>
                <TableCell>
                  {new Date(guest.checkIn).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(guest.checkOut).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditGuest(guest)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Редактировать гостя</DialogTitle>
        <DialogContent>
          {editedGuest && (
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Имя"
                value={editedGuest.name}
                onChange={(e) =>
                  setEditedGuest({ ...editedGuest, name: e.target.value })
                }
              />
              <TextField
                label="Email"
                value={editedGuest.email}
                onChange={(e) =>
                  setEditedGuest({ ...editedGuest, email: e.target.value })
                }
              />
              <TextField
                label="Телефон"
                value={editedGuest.phone}
                onChange={(e) =>
                  setEditedGuest({ ...editedGuest, phone: e.target.value })
                }
              />
              <TextField
                label="Комната"
                value={editedGuest.roomNumber}
                onChange={(e) =>
                  setEditedGuest({ ...editedGuest, roomNumber: e.target.value })
                }
              />
              <TextField
                label="Новый пароль"
                type="password"
                onChange={(e) =>
                  setEditedGuest({ ...editedGuest, password: e.target.value })
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSaveGuest} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminGuests;
