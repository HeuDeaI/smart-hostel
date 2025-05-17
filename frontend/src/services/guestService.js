import axios from "axios";
import { baseUrl } from "../config/BaseUrl";

const API_URL = `${baseUrl}/api/guests`;

export const getGuests = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGuestInfo = async (guestId) => {
  try {
    const response = await axios.get(`${API_URL}/${guestId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGuest = async (guestId, guestData) => {
  try {
    const response = await axios.put(`${API_URL}/${guestId}`, guestData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGuest = async (guestId) => {
  try {
    const response = await axios.delete(`${API_URL}/${guestId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
