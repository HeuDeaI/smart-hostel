import axios from "axios";
import { baseUrl } from "../config/BaseUrl";

const API_URL = `${baseUrl}/rooms`;

export const getRooms = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRoomInfo = async (roomId) => {
  try {
    const response = await axios.get(`${API_URL}/${roomId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRoom = async (roomId, roomData) => {
  try {
    const response = await axios.put(`${API_URL}/${roomId}`, roomData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRoom = async (roomId) => {
  try {
    const response = await axios.delete(`${API_URL}/${roomId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
