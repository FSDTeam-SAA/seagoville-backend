import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import analysisService from "./analysis.service";

const toppingsAnalysis = catchAsync(async (req, res) => {
  const result = await analysisService.toppingsAnalysis();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Toppings fetched successfully",
    data: result,
  });
});

const getReviewAnalysis = catchAsync(async (req, res) => {
  const result = await analysisService.getReviewAnalysis();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
});

const couponsAnalysis = catchAsync(async (req, res) => {
  const result = await analysisService.couponsAnalysis();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupons fetched successfully",
    data: result,
  });
});

const paymentAnalysis = catchAsync(async (req, res) => {
  const result = await analysisService.paymentAnalysis();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payments fetched successfully",
    data: result,
  });
});

const getDashboardAnalysis = catchAsync(async (req, res) => {
  const result = await analysisService.getDashboardAnalysis();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard fetched successfully",
    data: result,
  });
});

const analysisController = {
  toppingsAnalysis,
  getReviewAnalysis,
  couponsAnalysis,
  paymentAnalysis,
  getDashboardAnalysis,
};

export default analysisController;
