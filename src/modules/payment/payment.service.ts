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

const paymentService = {
  createPayment,
};

export default paymentService;
