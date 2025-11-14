import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";

const reviewModel = new Schema<IReview>(
  {
    rating: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const review = model<IReview>("Review", reviewModel);

export default review;
