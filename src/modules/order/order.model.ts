import { Schema, model } from "mongoose";
import { IOrder } from "./order.interface";

const OrderSchema = new Schema<IOrder>(
  {
    deviceIp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["single", "multi"],
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
    },
    cart: [
      {
        cartId: {
          type: Schema.Types.ObjectId,
          ref: "Cart",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    size: {
      type: String,
      enum: ["small", "medium", "large"],
    },
    couponCode: {
      type: String,
      default: "",
    },
    finalPrice: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "rejected", "delivered"],
      default: "pending",
    },
    deliveryDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      note: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Order = model<IOrder>("Order", OrderSchema);

export default Order;
