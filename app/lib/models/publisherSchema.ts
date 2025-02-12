import { IPublisher } from "@/app/types/IPublisher";
import mongoose, { Schema, Document } from "mongoose";

const PublisherSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
});

const Publisher = mongoose.model<IPublisher>("Publisher", PublisherSchema);

export default Publisher;
