import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";
import config from "../../config";
import AppError from "../../errors/AppError";
import Order from "../order/order.model";
import Payment from "./payment.model";

const stripe = new Stripe(config.stripe.secretKey as string);

const createPayment = async (
  payload: { orderId: string },
  deviceIp: string
) => {
  const { orderId } = payload;

  const order = await Order.findOne({ _id: orderId, deviceIp });
  if (!order) {
    throw new AppError("Order not found", StatusCodes.NOT_FOUND);
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.finalPrice * 100),
    currency: "usd",
    metadata: { orderId: order._id.toString(), deviceIp },
  });

  const paymentRecord = await Payment.create({
    deviceIp,
    orderId: order._id,
    amount: order.finalPrice,
    transactionId: paymentIntent.id,
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentId: paymentRecord._id,
  };
};

const confirmPayment = async (payload: { transactionId: string }) => {
  const { transactionId } = payload;

  const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);

  // 2️⃣ Determine status
  const status: "success" | "failed" =
    paymentIntent.status === "succeeded" ? "success" : "failed";

  // 3️⃣ Update payment record in DB
  const updatedPayment = await Payment.findOneAndUpdate(
    { transactionId },
    { status },
    { new: true }
  );

  if (!updatedPayment) {
    throw new AppError("Payment not found", StatusCodes.NOT_FOUND);
  }

  return {
    paymentId: updatedPayment._id,
    status: updatedPayment.status,
    amount: updatedPayment.amount,
    stripeStatus: paymentIntent.status,
  };
};

const getAllPayments = async (page: number, limit: number, status?: string) => {
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: Record<string, any> = {};
  if (
    status &&
    ["pending", "success", "failed"].includes(status.toLowerCase())
  ) {
    filter.status = status.toLowerCase();
  }

  // Get total count
  const total = await Payment.countDocuments(filter);

  // Fetch paginated data
  const data = await Payment.find(filter)
    .populate("orderId")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(total / limit);

  return {
    total,
    totalPages,
    data,
  };
};


const paymentService = {
  createPayment,
  confirmPayment,
  getAllPayments,
};

export default paymentService;
