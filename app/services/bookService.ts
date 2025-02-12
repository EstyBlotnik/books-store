import axios from "axios";
import IBook from "../types/IBook";
export interface bookData {
  tytle: string;
  condition: string;
  price: number;
  categories: string[];
  stock: number;
  author: string;
  publisher: string | null;
  coverType: string;
  yearOfPublication: number;
  description: string | null;
  rare: boolean;
  signed: boolean;
  salePrice: number | null;
  image: string | null;
}
export const addBook = async (bookData: bookData) => {
  console.log(bookData);
  try {
    const response = await axios.post("/api/book", {
      ...bookData,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add the book.");
    }
    throw new Error("An unknown error occurred");
  }
};

export const getAllBooks = async (): Promise<IBook[]> => {
  try {
    const response = await axios.get("/api/book");
    console.log("response from service: ", response)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add the book.");
    }
    throw new Error("An unknown error occurred");
  }
};
