import axios from "axios";
import API_BASE_URL from "../config"; // ✅ dùng local config

const API_URL = `${API_BASE_URL}/api`;

export const updateQuestion = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(`${API_URL}/quiz/${id}/questions`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else {
      console.error("Unexpected Error:", error.message);
    }
    throw error;
  }
};
