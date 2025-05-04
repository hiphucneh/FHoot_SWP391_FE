// services/deletePackage.js
import axios from 'axios';

const API_BASE_URL = "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/package";

const deletePackage = async (packageId) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication token not found");
    }

    try {
        const response = await axios.delete(`${API_BASE_URL}/${packageId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting package:", error);
        throw error;
    }
};

export default deletePackage;