import { Schema, model, Document } from 'mongoose';

interface Session extends Document {
  id: string;
  userId: string;
  date: Date;
  mode: string,
  averageScore: number;
  wordsCount: number;
  updatedAt: Date;
  locallyUpdatedAt: Date;
}

const sessionSchema = new Schema<Session>({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  mode: { type: String, required: true },
  averageScore: { type: Number, required: true },
  wordsCount: { type: Number, required: true },
  locallyUpdatedAt: { type: Date, required: true },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: { updatedAt: 'updatedAt', createdAt: false },
});

sessionSchema.virtual('id').get(function(this: Session) {
  return this._id;
});

export default model<Session>('Session', sessionSchema);