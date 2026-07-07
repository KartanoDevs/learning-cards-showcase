import { Schema, model, Document, Types } from 'mongoose';

export interface CardDoc extends Document {
  english: string;
  spanish: string;
  imageUrl?: string | null;
  groupId: Types.ObjectId;
  order?: number;
  enabled: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema<CardDoc>(
  {
    english: { type: String, required: true, trim: true },
    spanish: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: null },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true, index: true },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true, index: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Índices útiles
CardSchema.index({ groupId: 1, enabled: 1, order: 1 });
CardSchema.index({ english: 'text', spanish: 'text', tags: 'text' });

export const Card = model<CardDoc>('Card', CardSchema);
