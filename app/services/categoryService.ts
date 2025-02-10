// services/categoryService.ts
import axios from "axios";

export const getCategories = async () => {
  try {
    const response = await axios.get("/api/categories");
    return response.data; // Assuming the data is an array of category names or IDs
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
