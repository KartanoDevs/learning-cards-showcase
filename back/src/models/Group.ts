import { Schema, model, Document } from 'mongoose';

export interface GroupDoc extends Document {
  name: string;
  slug: string;
  description: { type: String },
  iconUrl?: string | null;
  order?: number;
  enabled: boolean;
  fav: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<GroupDoc>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    iconUrl: { type: String, default: null },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
    fav: { type: Boolean, default: false },
  },
  { timestamps: true }
);

GroupSchema.index({ enabled: 1, order: 1 });

export const Group = model<GroupDoc>('Group', GroupSchema);
