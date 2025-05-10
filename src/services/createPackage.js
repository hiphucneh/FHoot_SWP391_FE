import axios from "axios";
import API_BASE_URL from "../config";

const API_URL = `${API_BASE_URL}/api`;

export const createPackage = async (packageData) => {
    try {
        const token = localStorage.getItem("token")

        const response = await axios.post(`${API_URL}/package`, packageData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const packageId = response.data?.data?.packageId;
        if (packageId) {
            localStorage.setItem("packageId", packageId.toString());

        }

        return response.data;
    } catch (error) {
        console.error("❌ Create Package API error:", error);
        throw error;
    }
};
