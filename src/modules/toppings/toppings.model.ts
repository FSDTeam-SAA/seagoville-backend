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
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
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

const Toppings = model<ITopping>("Toppings", toppingsModel);
export default Toppings;
