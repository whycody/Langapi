import { Schema, model, Document } from 'mongoose';

export interface WordHeuristicState extends Document {
  wordId: string;
  userId: string;
  interval: number;
  repetitionsCount: number;
  lastReviewDate: Date;
  nextReviewDate: Date;
  EF: number;
  synced: boolean;
  updatedAt?: Date;
  locallyUpdatedAt: Date;
}

const wordHeuristicStateSchema = new Schema<WordHeuristicState>({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  interval: { type: Number, required: true },
  repetitionsCount: { type: Number, required: true },
  lastReviewDate: { type: Date, required: true },
  nextReviewDate: { type: Date, required: true },
  EF: { type: Number, required: true },
  synced: { type: Boolean, required: true, default: false },
  updatedAt: { type: Date },
  locallyUpdatedAt: { type: Date, required: true, default: Date.now },
}, {
  timestamps: { updatedAt: 'updatedAt', createdAt: false },
});

wordHeuristicStateSchema.virtual('wordId').get(function(this: WordHeuristicState) {
  return this._id;
});

export default model<WordHeuristicState>('WordHeuristicState', wordHeuristicStateSchema, 'word_heuristic_states');