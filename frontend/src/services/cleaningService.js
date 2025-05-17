import axios from "axios";
import { API_URL } from "../config/BaseUrl";

export const requestCleaning = async (roomNumber, userId, notes = "") => {
  try {
    const response = await axios.post(`${API_URL}/cleaning-requests`, {
      roomNumber,
      userId,
      notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error requesting cleaning:", error);
    throw error;
  }
};

export const getCleaningRequests = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/cleaning-requests`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cleaning requests:", error);
    throw error;
  }
};

export const updateCleaningRequestStatus = async (requestId, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/cleaning-requests/${requestId}`,
      {
        status,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cleaning request:", error);
    throw error;
  }
};

export const checkCleaningRequest = async (roomNumber, userId) => {
  const response = await axios.get(
    `${API_URL}/cleaning/status?roomNumber=${roomNumber}&userId=${userId}`
  );
  return response.data.hasActiveRequest; // true/false
};
