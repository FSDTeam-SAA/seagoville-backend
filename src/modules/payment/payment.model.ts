import { model, Schema } from "mongoose";

const paymentModel = new Schema(
  {
    deviceIp: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    transactionId: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Payment = model("Payment", paymentModel);

export default Payment;
