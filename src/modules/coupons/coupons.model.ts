import { Schema, model } from "mongoose";
import { ICoupon } from "./coupons.interface";

const CouponSchema = new Schema<ICoupon>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    discountType: {
      type: String,
      required: true,
      //   enum: ["Fixed Price", "Percentage", "Amount", "BuyXGetY"], // optional
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    timesUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Coupon = model<ICoupon>("Coupon", CouponSchema);
