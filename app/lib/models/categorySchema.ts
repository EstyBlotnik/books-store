import { ICategory } from "@/app/types/ICategory";
import mongoose, { Schema, Model } from "mongoose";

const CategorySchema: Schema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  parentCategory: {
    type: String,
    required: true,
    enum: ["עיון", "פרוזה", "ילדים ונוער"],
  },
});

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
