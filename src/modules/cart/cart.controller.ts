import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import cartService from "./cart.service";

const menuAddToCart = catchAsync(async (req, res) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const deviceIp =
    typeof forwardedFor === "string"
      ? forwardedFor
      : Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : req.ip || "unknown";

  const result = await cartService.menuAddToCart(req.body, deviceIp);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Menu added to cart successfully",
    data: result,
  });
});

const getCart = catchAsync(async (req, res) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const deviceIp =
    typeof forwardedFor === "string"
      ? forwardedFor
      : Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : req.ip || "unknown";

  const result = await cartService.getCart(deviceIp);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Cart fetched successfully",
    data: result,
  });
});

const incrementQuantity = catchAsync(async (req, res) => {
  const { cartId } = req.params;

  const forwardedFor = req.headers["x-forwarded-for"];
  const deviceIp =
    typeof forwardedFor === "string"
      ? forwardedFor
      : Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : req.ip || "unknown";

  const result = await cartService.incrementQuantity(deviceIp, cartId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Quantity incremented successfully",
    data: result,
  });
});

const decrementQuantity = catchAsync(async (req, res) => {
  const { cartId } = req.params;

  const forwardedFor = req.headers["x-forwarded-for"];
  const deviceIp =
    typeof forwardedFor === "string"
      ? forwardedFor
      : Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : req.ip || "unknown";

  const result = await cartService.decrementQuantity(deviceIp, cartId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Quantity decremented successfully",
    data: result,
  });
});

const deleteCart = catchAsync(async (req, res) => {
  const { cartId } = req.params;

  const forwardedFor = req.headers["x-forwarded-for"];
  const deviceIp =
    typeof forwardedFor === "string"
      ? forwardedFor
      : Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : req.ip || "unknown";

  await cartService.deleteCart(deviceIp, cartId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Quantity decremented successfully",
  });
});

const cartController = {
  menuAddToCart,
  getCart,
  incrementQuantity,
  decrementQuantity,
  deleteCart,
};

export default cartController;
