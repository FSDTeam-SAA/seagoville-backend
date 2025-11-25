import { model, Schema } from "mongoose";
import { ICart } from "./cart.interface";

const cartModel = new Schema<ICart>(
  {
    menu: {
      menuId: {
        type: Schema.Types.ObjectId,
        ref: "Menu",
      },
      price: {
        type: Number,
      },
      sizes: {
        type: [String],
      },
      types: {
        type: String,
      },
    },
    ownPizzaId: {
      type: Schema.Types.ObjectId,
      ref: "OwnPizza",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    totalPrice: {
      type: Number,
      // required: true,
    },
    deviceIp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Cart = model("Cart", cartModel);

export default Cart;
