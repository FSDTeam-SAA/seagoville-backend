import { Schema, model } from "mongoose";
import { IMenu } from "./menu.interface";

const menuSchema = new Schema<IMenu>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    price: {
      small: {
        type: Number,
        required: true,
        min: 0,
      },
      medium: {
        type: Number,
        required: true,
        min: 0,
      },
      large: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Menu = model<IMenu>("Menu", menuSchema);
