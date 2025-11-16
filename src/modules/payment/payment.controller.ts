import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import paymentService from "./payment.service";

const createPayment = catchAsync(async (req, res) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const deviceIp =
    typeof forwardedFor === "string"
      ? forwardedFor
      : Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : req.ip || "unknown";

  const result = await paymentService.createPayment(req.body, deviceIp);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
});

const paymentController = {
  createPayment,
};

export default paymentController;
