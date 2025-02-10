import axios from "axios";

export const addBook = async (bookData: {
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
}) => {
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
