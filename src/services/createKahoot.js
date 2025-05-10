import axios from "axios";
import API_BASE_URL from "../config"; // ✅ thêm dòng này

const API_URL = `${API_BASE_URL}/api`; // ✅ dùng local server

export const createKahoot = async (kahootData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/quiz`, kahootData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    const quizId = response.data?.data?.quizId;
    if (quizId) {
      localStorage.setItem("quizId", quizId.toString());
      localStorage.setItem("quizTitle", kahootData.get("Title"));
      localStorage.setItem("token", token);
    }

    return response.data;
  } catch (error) {
    console.error("❌ Create Kahoot API error:", error);
    throw error;
  }
};
