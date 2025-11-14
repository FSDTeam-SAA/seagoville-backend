import { model, Schema } from "mongoose";

const subscriptionModel = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Subscription = model("Subscription", subscriptionModel);

export default Subscription;
