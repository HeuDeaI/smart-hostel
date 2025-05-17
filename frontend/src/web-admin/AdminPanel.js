import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MeetingRoom as RoomIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminGuests from "./AdminGuests";
import AdminRooms from "./AdminRooms";

const drawerWidth = 240;

const AdminPanel = () => {
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Очистка токена и редирект на страницу входа
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderPage = () => {
    switch (selectedPage) {
      case "dashboard":
        return <AdminDashboard />;
      case "guests":
        return <AdminGuests />;
      case "rooms":
        return <AdminRooms />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Админ-панель
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar>A</Avatar>
            <Box>
              <Typography variant="subtitle1">Администратор</Typography>
              <Typography variant="body2" color="text.secondary">
                admin@example.com
              </Typography>
            </Box>
          </Box>
          <Divider />
          <List>
            <ListItem button onClick={() => setSelectedPage("dashboard")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Панель управления" />
            </ListItem>
            <ListItem button onClick={() => setSelectedPage("guests")}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Гости" />
            </ListItem>
            <ListItem button onClick={() => setSelectedPage("rooms")}>
              <ListItemIcon>
                <RoomIcon />
              </ListItemIcon>
              <ListItemText primary="Комнаты" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Выйти" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderPage()}
      </Box>
    </Box>
  );
};

export default AdminPanel;
