import axios from "axios";

const API_URL = "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api";

export const createKahoot = async (kahootData) => {
    try {
        const token = localStorage.getItem("token")

        const response = await axios.post(`${API_URL}/quiz`, kahootData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
            },
        });

        const quizId = response.data?.data?.quizId;
        if (quizId) {
            localStorage.setItem("quizId", quizId.toString());
            localStorage.setItem("quizTitle", kahootData.get("Title"));
            localStorage.setItem("token", token); // Lưu token vào localStorage nếu cần thiết
        }

        return response.data; // vẫn trả về để component dùng nếu muốn
    } catch (error) {
        console.error("❌ Create Kahoot API error:", error);
        throw error;
    }
};
