import { IReview } from "./review.interface";
import review from "./review.model";

const createReview = async (payload: IReview) => {
  const result = await review.create(payload);
  return result;
};

const getAllReviews = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const reviews = await review
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await review.countDocuments();
  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    data: reviews,
  };
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
