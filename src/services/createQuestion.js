import axios from "axios";
import API_BASE_URL from "../config"; // ✅ dùng local API

export const createQuestion = async (questionData) => {
  try {
    const quizId = localStorage.getItem("quizId");
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_BASE_URL}/api/quiz/${quizId}/questions`,
      questionData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Create Question API error:", error);
    throw error;
  }
};
