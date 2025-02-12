import mongoose from "mongoose";
import { z } from "zod";
import { ICategory } from "./ICategory";
import { IPublisher } from "./IPublisher";

export default interface IBook extends Document {
  SKU: number; // Unique identifier (auto-incremented, generated in code)
  title: string; // Book name
  condition: "כחדש" | "טוב" | "סביר"; // Book condition
  price: number; // Price of the book
  categories: string[] | ICategory[]; // Categories array (at least one category required)
  stock: number; // Quantity in stock
  sold: number; // Number of items sold (default: 0)
  views: number; // Number of views (default: 0)
  author: string;
  publisher: mongoose.Types.ObjectId | IPublisher;
  coverType: "רכה" | "קשה" | "קרטון" | "כללי";
  yearOfPublication: number;
  image: string;
  description: string;
  rare: boolean;
  signed: boolean;
  salePrice: number;
}

export const bookSchema = z.object({
  title: z.string().min(2, "שם הספר חייב להכיל לפחות 2 תווים"),
  condition: z.enum(["כחדש", "טוב", "סביר"], {
    errorMap: () => ({ message: "יש לבחור מצב לספר" }),
  }),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "מחיר חייב להיות מספר חוקי"),
  categories: z
    .array(z.string())
    .min(1, "יש לבחור לפחות קטגוריה אחת מתוך רשימת הקטגוריות"),
  stock: z.number().min(1, "הכמות במלאי חייבת להיות לפחות 1"),
  author: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => val === undefined || val.length >= 2, {
      message: "שם הסופר חייב להכיל לפחות 2 תווים",
    }),

  publisher: z.string().optional(),
  coverType: z.string(),
  yearOfPublication: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => val === undefined || /^\d{4}$/.test(val), {
      message: "שנת הפרסום חייבת להיות בפורמט תקין",
    }),

  description: z.string().optional(),
  rare: z.boolean(),
  signed: z.boolean(),
  salePrice: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => val === undefined || /^\d+(\.\d{1,2})?$/.test(val), {
      message: "מחיר מבצע חייב להיות מספר חוקי",
    }),
});

export type IBookSchema = z.infer<typeof bookSchema>;
