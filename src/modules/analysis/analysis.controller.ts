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

const analysisController = {
  toppingsAnalysis,
  getReviewAnalysis,
  couponsAnalysis,
};

export default analysisController;
