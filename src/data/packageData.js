// quizzData.js
import axios from "axios";

const API_BASE_URL = "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/package";

class PackageData {
    static async fetchAllPackage() {
        const token = localStorage.getItem("token");


        if (!token) {
            throw new Error("Missing token ");
        }

        try {
            const response = await axios.get(`${API_BASE_URL}`, {
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

export default PackageData;
