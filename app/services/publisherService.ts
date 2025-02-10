import axios from "axios";

export const getPublishers = async () => {
  try {
    const response = await axios.get("/api/publishers");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
