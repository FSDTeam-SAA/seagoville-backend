import { model, Schema } from "mongoose";
import { ITopping } from "./toppings.interface";

const toppingsModel = new Schema<ITopping>({
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
    type: String,
    required: true,
  },
});

const Toppings = model<ITopping>("Toppings", toppingsModel);

export default Toppings;
