import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import orderService from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const deviceIp =
    typeof forwardedFor === "string"
      ? forwardedFor
      : Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : req.ip || "unknown";

  const result = await orderService.createOrder(req.body, deviceIp);

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

const orderController = {
  createOrder,
  getMyOrders,
};

export default orderController;
