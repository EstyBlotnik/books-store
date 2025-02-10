import mongoose, { Schema, Document } from 'mongoose';

interface IPublisher extends Document {
  name: string;
}

const PublisherSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true }
});

const Publisher = mongoose.model<IPublisher>('Publisher', PublisherSchema);

export default Publisher;
