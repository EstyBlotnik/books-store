import mongoose from "mongoose";

export default interface IBook extends Document {
  SKU: number; // Unique identifier (auto-incremented, generated in code)
  tytle: string; // Book name
  condition: "כחדש" | "טוב" | "סביר"; // Book condition
  price: number; // Price of the book
  categories: string[]; // Categories array (at least one category required)
  stock: number; // Quantity in stock
  sold: number; // Number of items sold (default: 0)
  views: number; // Number of views (default: 0)
  author: string;
  publisher: mongoose.Types.ObjectId;
  coverType: "רכה" | "קשה" | "קרטון";
  yearOfPublication: number;
  image: string;
  description: string;
  rare: boolean;
  signed: boolean;
  salePrice: number;
};