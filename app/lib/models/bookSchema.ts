import mongoose, { Schema, Model } from "mongoose";
import IBook from "@/app/types/IBook";

const BookSchema: Schema = new Schema({
  name: { type: String, required: true },
  condition: { type: String, required: true, enum: ["כחדש", "טוב", "סביר"] },
  price: { type: Number, required: true, min: 0 },
  categories: {
    type: [String],
    required: true,
    validate: [
      (value: string[]) => value.length > 0,
      "A book must have at least one category.",
    ],
  },
  stock: { type: Number, required: true, min: 0 },
  sold: { type: Number, default: 0, min: 0 },
  views: { type: Number, default: 0, min: 0 },
});

let bookIdCounter = 0; // Counter for generating unique IDs
BookSchema.pre("save", function (next) {
  if (!this.SKU) {
    this.SKU = ++bookIdCounter;
  }
  next();
});

const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);
export default Book;
