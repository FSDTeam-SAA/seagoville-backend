import { model, Schema } from "mongoose";
import { IOwnPizza } from "./ownPizza.interface";

const toppingItemSchema = new Schema(
  {
    toppingId: {
      type: Schema.Types.ObjectId,
      ref: "Toppings",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ownPizzaModel = new Schema<IOwnPizza>(
  {
    size: { type: Schema.Types.ObjectId, ref: "Toppings" },
    crust: { type: Schema.Types.ObjectId, ref: "Toppings" },
    sauce: { type: Schema.Types.ObjectId, ref: "Toppings" },
    cheese: { type: Schema.Types.ObjectId, ref: "Toppings" },
    toppings: [toppingItemSchema],
    totalPrice: { type: Number },
    deviceIp: { type: String },
    isDelivered: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ownPizza = model("OwnPizza", ownPizzaModel);

export default ownPizza;
