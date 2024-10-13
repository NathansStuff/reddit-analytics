import mongoose, { Schema, Document } from 'mongoose';

export interface ISubreddit extends Document {
  name: string;
  description: string;
  subscribers: number;
  lastUpdated: Date;
}

const SubredditSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  subscribers: { type: Number, required: true },
  lastUpdated: { type: Date, required: true },
});

export default mongoose.models.Subreddit || mongoose.model<ISubreddit>('Subreddit', SubredditSchema);
