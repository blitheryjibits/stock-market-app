import { Schema, model, models, type Document, type Model } from "mongoose";

export interface UserProfileDocument extends Document {
  userId: string;
  displayName: string;
  image: string;
  updatedAt: Date;
  settings?: Record<string, unknown>;
}

const UserProfileSchema = new Schema<UserProfileDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    updatedAt: { type: Date, default: () => new Date() },
    settings: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export const UserProfile: Model<UserProfileDocument> =
  (models?.UserProfile as Model<UserProfileDocument>) ||
  model<UserProfileDocument>("UserProfile", UserProfileSchema);
