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

const cartController = {
  menuAddToCart,
  getCart,
};

export default cartController;
