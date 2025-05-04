// quizzData.js
import axios from "axios";

const API_BASE_URL = "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/quiz";

class QuizzData {
    static async fetchQuizById() {
        const token = localStorage.getItem("token");
        const quizId = localStorage.getItem("quizId");

        if (!token || !quizId) {
            throw new Error("Missing token or quiz ID in localStorage");
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/${quizId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("❌ Failed to fetch quiz data:", error);
            throw error;
        }
    }
}

export default QuizzData;
