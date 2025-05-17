import axios from "axios";
import { API_URL } from "../config/BaseUrl";

export const getRoomInfo = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/rooms/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching room info:", error);
    throw error;
  }
};
