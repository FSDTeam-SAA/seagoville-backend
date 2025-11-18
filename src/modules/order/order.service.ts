/* eslint-disable prefer-const */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import Cart from "../cart/cart.model";
import { Coupon } from "../coupons/coupons.model";
import { Menu } from "../menu/menu.model";
import Notification from "../notification/notification.model";
import ownPizza from "../ownPizza/ownPizza.model";
import { User } from "../user/user.model";
import { IOrder } from "./order.interface";
import Order from "./order.model";


const createOrder = async (payload: IOrder, deviceIp: string, io: any) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const { type, productId, size, cart, couponCode, deliveryDetails } =
      payload;
    let orderCart = [];
    let totalPrice = 0;
    let coupon = null;
    let discountAmount = 0;

    // SINGLE ORDER
    if (type === "single") {
      if (!productId || !size)
        throw new AppError("Product and size required", 400);

      const product = await Menu.findById(productId).lean();
      if (!product?.isAvailable) throw new AppError("Product unavailable", 400);

      const price = product.price[size as keyof typeof product.price];

      orderCart.push({
        cartId: product._id,
        quantity: 1,
        totalPrice: price,
        size,
      });

      totalPrice = price;
    }

    // MULTI ORDER
    else {
      const cartIds = cart.map((c) => c.cartId);
      const dbCart = await Cart.find({
        _id: { $in: cartIds },
        deviceIp,
      })
        .populate("ownPizzaId")
        .lean();

      if (dbCart.length !== cart.length)
        throw new AppError("Cart mismatch", 400);

      dbCart.forEach((item) => {
        orderCart.push({
          cartId: item._id,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        });

        totalPrice += item.totalPrice;
      });

      // ➤ OWN PIZZA DELETE (from cart + ownPizza table)
      const ownPizzaIds = dbCart
        .filter((item) => item.type === "ownPizza" && item.ownPizzaId)
        .map((item) => item.ownPizzaId._id);

      if (ownPizzaIds.length > 0) {
        await ownPizza
          .deleteMany({ _id: { $in: ownPizzaIds } })
          .session(session);
      }
    }

    // APPLY COUPON
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode }).lean();
      if (!coupon || !coupon.isActive)
        throw new AppError("Invalid coupon", 400);

      const now = new Date();
      if (now < coupon.startDate || now > coupon.endDate)
        throw new AppError("Coupon expired", 400);

      const raw = coupon.discountAmount;
      discountAmount =
        typeof raw === "string" && raw.includes("%")
          ? (totalPrice * Number(raw.replace("%", ""))) / 100
          : Number(raw);
    }

    const finalPrice = Math.max(totalPrice - discountAmount, 0);

    // CREATE ORDER
    const newOrder = await Order.create(
      [
        {
          deviceIp,
          type,
          cart: orderCart,
          couponCode: couponCode || "",
          finalPrice,
          deliveryDetails,
          productId: type === "single" ? productId : undefined,
        },
      ],
      { session }
    );

    // UPDATE COUPON
    if (coupon)
      await Coupon.findByIdAndUpdate(
        coupon._id,
        { $inc: { timesUsed: 1 } },
        { session }
      );

    // UPDATE TOTAL SOLD
    if (type === "single") {
      await Menu.findByIdAndUpdate(
        productId,
        { $inc: { totalSold: 1 } },
        { session }
      );
    } else {
      await Promise.all(
        orderCart.map((c) =>
          Menu.findByIdAndUpdate(
            c.cartId,
            { $inc: { totalSold: 1 } },
            { session }
          )
        )
      );
    }

    // DELETE cart items
    await Cart.deleteMany({
      _id: { $in: cart.map((c) => c.cartId) },
      deviceIp,
    }).session(session);

    // Send admin notifications
    const adminUsers = await User.find({ role: "admin" }).lean();

    if (io && adminUsers?.length) {
      for (const admin of adminUsers) {
        if (!admin._id) continue;

        const notify = await Notification.create(
          [
            {
              to: admin._id,
              message: `New order created by ${deliveryDetails.fullName} phone ${deliveryDetails.phone}`,
              type: "order",
              id: newOrder[0]._id,
            },
          ],
          { session }
        );

        io.to(String(admin._id)).emit("newNotification", notify);
      }
    }

    await session.commitTransaction();
    session.endSession();

    return newOrder[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getMyOrders = async () => {
  const orders = await Order.find({}).lean();
  return orders;
};

const getAllOrders = async (page: number, limit: number, status?: string) => {
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = {};
  if (status && ["pending", "rejected", "delivered"].includes(status)) {
    filter.status = status;
  }

  const total = await Order.countDocuments(filter);

  const orders = await Order.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  return {
    data: orders,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleOrder = async (orderId: string) => {
  const order = await Order.findById(orderId).lean();
  return order;
};

//! when admin toggle then go email to customer-----------------------------------
//! Also in when user order then go email to admin--------------------------------------------------------------------------
const toggleOrderStatus = async (orderId: string, status: string) => {
  console.log(orderId);

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError("Order not found", StatusCodes.NOT_FOUND);
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  //! Not working right now
  if (status === "delivered") {
    // await sendOrderDeliveredEmail(order.deliveryDetails.email);
    await ownPizza.findOneAndUpdate(
      { _id: order.productId },
      { isDelivered: true }
    );
  }

  return updatedOrder;
};

const getCustomers = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  // Count total orders
  const total = await Order.countDocuments();

  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .select("deliveryDetails finalPrice status createdAt")
    .skip(skip)
    .limit(limit)
    .lean();

  const result = orders.map((o) => ({
    fullName: o.deliveryDetails.fullName,
    email: o.deliveryDetails.email,
    phone: o.deliveryDetails.phone,
    address: o.deliveryDetails.address,
    totalSpent: o.finalPrice,
    orderStatus: o.status,
    orderCreatedAt: o.createdAt,
  }));

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const orderService = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  toggleOrderStatus,
  getCustomers,
};

export default orderService;
