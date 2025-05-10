import axios from "axios";
import API_BASE_URL from "../config"; // ✅ thêm dòng này

const PACKAGE_URL = `${API_BASE_URL}/api/package`; // ✅ dùng local API

const deletePackage = async (packageId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  try {
    const response = await axios.delete(`${PACKAGE_URL}/${packageId}`, {
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
