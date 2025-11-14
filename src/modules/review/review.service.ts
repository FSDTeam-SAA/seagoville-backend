import { IReview } from "./review.interface";
import review from "./review.model";

const createReview = async (payload: IReview) => {
  const result = await review.create(payload);
  return result;
};

const getAllReviews = async () => {
  const result = await review.find();
  return result;
};

const getSingleReview = async (id: string) => {
  const isReviewExist = await review.findById(id);
  if (!isReviewExist) {
    throw new Error("Review not found");
  }

  const result = await review.findById(id);
  return result;
};

const deleteReview = async (id: string) => {
  const isReviewExist = await review.findById(id);
  if (!isReviewExist) {
    throw new Error("Review not found");
  }

  await review.findByIdAndDelete(id);
};

const reviewService = {
  createReview,
  getAllReviews,
  getSingleReview,
  deleteReview,
};

export default reviewService;
