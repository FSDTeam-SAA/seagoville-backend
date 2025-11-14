import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import reviewService from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const result = await reviewService.createReview(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const result = await reviewService.getAllReviews();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
});

const getSingleReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const result = await reviewService.getSingleReview(reviewId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review fetched successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  await reviewService.deleteReview(reviewId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review deleted successfully",
  });
});

const reviewController = {
  createReview,
  getAllReviews,
  getSingleReview,
  deleteReview,
};

export default reviewController;
