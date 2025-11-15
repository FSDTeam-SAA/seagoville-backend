import { model, Schema } from "mongoose";
import { ITopping } from "./toppings.interface";

const toppingsModel = new Schema<ITopping>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Toppings = model<ITopping>("Toppings", toppingsModel);
export default Toppings;
