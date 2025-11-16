/* eslint-disable prefer-const */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import Cart from "../cart/cart.model";
import { Coupon } from "../coupons/coupons.model";
import { IOrder } from "./order.interface";
import Order from "./order.model";

const createOrder = async (payload: IOrder, deviceIp: string) => {
  const { cart, couponCode, deliveryDetails } = payload;

  // 1️⃣ Fetch cart items from DB to ensure totalPrice & quantity are correct
  const cartIds = cart.map((c) => c.cartId);
  const dbCartItems = await Cart.find({
    _id: { $in: cartIds },
    deviceIp,
  }).lean();

  if (dbCartItems.length !== cart.length) {
    throw new AppError("Some cart items not found", StatusCodes.BAD_REQUEST);
  }

  // 2️⃣ Validate totalPrice for each cart item
  dbCartItems.forEach((item) => {
    if (typeof item.totalPrice !== "number" || isNaN(item.totalPrice)) {
      throw new AppError(
        `Cart item ${item._id} has invalid totalPrice`,
        StatusCodes.BAD_REQUEST
      );
    }
  });

  // 3️⃣ Calculate totalCartPrice
  let totalCartPrice = dbCartItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  // 4️⃣ Coupon validation and discount calculation
  let discountAmount = 0;
  let coupon = null;

  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode }).lean();

    if (!coupon) throw new AppError("Invalid coupon", StatusCodes.BAD_REQUEST);
    if (!coupon.isActive)
      throw new AppError("Coupon inactive", StatusCodes.BAD_REQUEST);

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      throw new AppError("Coupon expired", StatusCodes.BAD_REQUEST);
    }

    const rawDiscount = coupon.discountAmount; // "25%" or "50"

    if (typeof rawDiscount === "string" && rawDiscount.includes("%")) {
      const percentage = Number(rawDiscount.replace("%", ""));
      discountAmount = (totalCartPrice * percentage) / 100;
    } else {
      discountAmount = Number(rawDiscount); // Flat discount
    }
  }

  // 5️⃣ Calculate finalPrice
  const finalPrice = totalCartPrice - discountAmount;
  if (finalPrice < 0) throw new AppError("Final price calculation failed", 400);

  // 6️⃣ Create order
  const newOrder = await Order.create({
    deviceIp,
    cart: dbCartItems.map((c) => ({
      cartId: c._id,
      quantity: c.quantity,
      totalPrice: c.totalPrice,
    })),
    couponCode: couponCode || "",
    finalPrice,
    deliveryDetails,
  });

  // 7️⃣ Increment coupon usage
  if (coupon) {
    await Coupon.findOneAndUpdate(
      { _id: coupon._id },
      { $inc: { timesUsed: 1 } }
    );
  }

  // 8️⃣ Clear cart
  await Cart.deleteMany({ _id: { $in: cartIds }, deviceIp });

  return newOrder;
};

const getMyOrders = async () => {
  const orders = await Order.find({}).lean();
  return orders;
};

const orderService = {
  createOrder,
  getMyOrders,
};

export default orderService;
