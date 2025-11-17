import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import reviewService from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const io = req.app.get("io");
  const result = await reviewService.createReview(req.body, io);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const status = (req.query.status as string) || "all";
  const rating = req.query.rating ? Number(req.query.rating) : undefined;

  const result = await reviewService.getAllReviews(page, limit, status, rating);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reviews fetched successfully",
    meta: result.meta,
    data: result.data,
    reviewCount: result.reviewCount,
  });
});

const getApprovedReviews = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await reviewService.getApprovedReviews(page, limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reviews fetched successfully",
    meta: result.meta,
    data: result.data,
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

const toggleReviewStatus = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const { status } = req.body;
  const result = await reviewService.toggleReviewStatus(reviewId, status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review status toggled successfully",
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
  getApprovedReviews,
  getSingleReview,
  toggleReviewStatus,
  deleteReview,
};

export default reviewController;
