import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  subredditName: string;
  id: string;
  title: string;
  content: string;
  url: string;
  score: number;
  numComments: number;
  createdAt: Date;
  analysis: {
    solutionRequests: boolean;
    painAndAnger: boolean;
    adviceRequests: boolean;
    moneyTalk: boolean;
  };
}

const PostSchema: Schema = new Schema({
  subredditName: { type: String, required: true, index: true },
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  url: { type: String, required: true },
  score: { type: Number, required: true },
  numComments: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  analysis: {
    solutionRequests: { type: Boolean, required: true },
    painAndAnger: { type: Boolean, required: true },
    adviceRequests: { type: Boolean, required: true },
    moneyTalk: { type: Boolean, required: true },
  },
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
