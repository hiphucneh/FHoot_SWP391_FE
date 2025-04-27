import axios from "axios";

const API_BASE_URL = "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api";

export const updateKahoot = async (id, formData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_BASE_URL}/quiz/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data; // Trả về dữ liệu từ server
    } catch (error) {
        // In lỗi chi tiết ra console
        if (error.response) {
            console.error('API Error:', error.response.data);
        } else {
            console.error('Unexpected Error:', error.message);
        }
        throw error; // Re-throw để handle ở bên ngoài (ví dụ trong handleSubmit)
    }
};