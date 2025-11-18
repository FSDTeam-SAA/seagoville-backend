import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import orderService from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  const forwardedFor = req.headers["x-forwarded-for"];

  const deviceIp =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0].trim()
      : Array.isArray(forwardedFor)
      ? forwardedFor[0].split(",")[0].trim()
      : req.ip || "unknown";
  const io = req.app.get("io");

  const result = await orderService.createOrder(req.body, deviceIp, io);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req, res) => {
  const result = await orderService.getMyOrders();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const status = req.query.status as string;

  const result = await orderService.getAllOrders(page, limit, status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Orders fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await orderService.getSingleOrder(orderId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order fetched successfully",
    data: result,
  });
});

const toggleOrderStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const result = await orderService.toggleOrderStatus(orderId, status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order status toggled successfully",
    data: result,
  });
});

const getCustomers = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await orderService.getCustomers(page, limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customers fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const orderController = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  toggleOrderStatus,
  getCustomers,
};

export default orderController;
