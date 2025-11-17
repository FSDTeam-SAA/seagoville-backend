/* eslint-disable prefer-const */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import Cart from "../cart/cart.model";
import { Coupon } from "../coupons/coupons.model";
import { Menu } from "../menu/menu.model";
import { IOrder } from "./order.interface";
import Order from "./order.model";

const createOrder = async (payload: IOrder, deviceIp: string) => {
  const { type, productId, size, cart, couponCode, deliveryDetails } = payload;
  let orderCart = [];
  let totalPrice = 0;
  let coupon = null;
  let discountAmount = 0;

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
  } else {
    const cartIds = cart.map((c) => c.cartId);
    const dbCart = await Cart.find({ _id: { $in: cartIds }, deviceIp }).lean();
    if (dbCart.length !== cart.length) throw new AppError("Cart mismatch", 400);
    dbCart.forEach((item) => {
      orderCart.push({
        cartId: item._id,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      });
      totalPrice += item.totalPrice;
    });
  }

  // Coupon logic
  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode }).lean();
    if (!coupon || !coupon.isActive) throw new AppError("Invalid coupon", 400);
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

  const newOrder = await Order.create({
    deviceIp,
    type,
    cart: orderCart,
    couponCode: couponCode || "",
    finalPrice,
    deliveryDetails,
    productId: type === "single" ? productId : undefined,
  });

  // Update coupon usage
  if (coupon)
    await Coupon.findByIdAndUpdate(coupon._id, { $inc: { timesUsed: 1 } });

  // Update totalSold
  if (type === "single") {
    await Menu.findByIdAndUpdate(productId, { $inc: { totalSold: 1 } });
  } else {
    await Promise.all(
      orderCart.map((c) =>
        Menu.findByIdAndUpdate(c.cartId, { $inc: { totalSold: 1 } })
      )
    );
    await Cart.deleteMany({
      _id: { $in: cart.map((c) => c.cartId) },
      deviceIp,
    });
  }

  return newOrder;
};

const getMyOrders = async () => {
  const orders = await Order.find({}).lean();
  return orders;
};

const getAllOrders = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const total = await Order.countDocuments();

  const orders = await Order.find({})
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

//! ar time a ekta mail jabe
const toggleOrderStatus = async (orderId: string, status: string) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError("Order not found", StatusCodes.NOT_FOUND);
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  return updatedOrder;
};

const getCustomers = async () => {
  const customers = await Order.aggregate([
    {
      $group: {
        _id: "$deliveryDetails.email", // group by email
        fullName: { $first: "$deliveryDetails.fullName" },
        phone: { $first: "$deliveryDetails.phone" },
        address: { $first: "$deliveryDetails.address" },
        // totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$finalPrice" },
        orderStatus: { $addToSet: "$status" }, // array of distinct statuses
      },
    },
    {
      $project: {
        _id: 0,
        email: "$_id",
        fullName: 1,
        phone: 1,
        address: 1,
        // totalOrders: 1,
        totalSpent: 1,
        orderStatus: 1,
      },
    },
    { $sort: { totalOrders: -1 } },
  ]);

  return customers;
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

// const createOrder = async (payload: IOrder, deviceIp: string) => {
//   const { cart, couponCode, deliveryDetails, type } = payload;

//   // 1️⃣ Fetch cart items from DB to ensure totalPrice & quantity are correct
//   const cartIds = cart.map((c) => c.cartId);
//   const dbCartItems = await Cart.find({
//     _id: { $in: cartIds },
//     deviceIp,
//   }).lean();

//   if (dbCartItems.length !== cart.length) {
//     throw new AppError("Some cart items not found", StatusCodes.BAD_REQUEST);
//   }

//   // 2️⃣ Validate totalPrice for each cart item
//   dbCartItems.forEach((item) => {
//     if (typeof item.totalPrice !== "number" || isNaN(item.totalPrice)) {
//       throw new AppError(
//         `Cart item ${item._id} has invalid totalPrice`,
//         StatusCodes.BAD_REQUEST
//       );
//     }
//   });

//   // 3️⃣ Calculate totalCartPrice
//   let totalCartPrice = dbCartItems.reduce(
//     (sum, item) => sum + item.totalPrice,
//     0
//   );

//   // 4️⃣ Coupon validation and discount calculation
//   let discountAmount = 0;
//   let coupon = null;

//   if (couponCode) {
//     coupon = await Coupon.findOne({ code: couponCode }).lean();

//     if (!coupon) throw new AppError("Invalid coupon", StatusCodes.BAD_REQUEST);
//     if (!coupon.isActive)
//       throw new AppError("Coupon inactive", StatusCodes.BAD_REQUEST);

//     const now = new Date();
//     if (now < coupon.startDate || now > coupon.endDate) {
//       throw new AppError("Coupon expired", StatusCodes.BAD_REQUEST);
//     }

//     const rawDiscount = coupon.discountAmount; // "25%" or "50"

//     if (typeof rawDiscount === "string" && rawDiscount.includes("%")) {
//       const percentage = Number(rawDiscount.replace("%", ""));
//       discountAmount = (totalCartPrice * percentage) / 100;
//     } else {
//       discountAmount = Number(rawDiscount); // Flat discount
//     }
//   }

//   // 5️⃣ Calculate finalPrice
//   const finalPrice = totalCartPrice - discountAmount;
//   if (finalPrice < 0) throw new AppError("Final price calculation failed", 400);

//   // 6️⃣ Create order
//   const newOrder = await Order.create({
//     deviceIp,
//     cart: dbCartItems.map((c) => ({
//       cartId: c._id,
//       quantity: c.quantity,
//       totalPrice: c.totalPrice,
//     })),
//     couponCode: couponCode || "",
//     finalPrice,
//     deliveryDetails,
//   });

//   // 7️⃣ Increment coupon usage
//   if (coupon) {
//     await Coupon.findOneAndUpdate(
//       { _id: coupon._id },
//       { $inc: { timesUsed: 1 } }
//     );
//   }

//   // 8️⃣ Clear cart
//   await Cart.deleteMany({ _id: { $in: cartIds }, deviceIp });

//   return newOrder;
// };
