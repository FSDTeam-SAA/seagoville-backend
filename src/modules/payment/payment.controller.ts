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

const confirmPayment = catchAsync(async (req, res) => {
  const io = req.app.get("io");
  const result = await paymentService.confirmPayment(req.body, io);

  const message =
    result.status === "success"
      ? "Payment confirmed successfully"
      : "Payment failed";



  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message,
    data: result,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const status = req.query.status as string; // "pending", "success", "failed"

  const result = await paymentService.getAllPayments(page, limit, status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payments fetched successfully",
    meta: {
      page,
      limit,
      total: result.total,
      totalPages: result.totalPages,
    },
    data: result.data,
  });
});


const paymentController = {
  createPayment,
  confirmPayment,
  getAllPayments,
};

export default paymentController;
