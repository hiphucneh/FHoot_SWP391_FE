import axios from "axios";

const API_URL = "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api";

export const createPackage = async (packageData) => {
    try {
        const token = localStorage.getItem("token")

        const response = await axios.post(`${API_URL}/package`, packageData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const packageId = response.data?.data?.packageIdId;
        if (packageId) {
            localStorage.setItem("packageId", packageId.toString());

        }

        return response.data;
    } catch (error) {
        console.error("❌ Create Package API error:", error);
        throw error;
    }
};
