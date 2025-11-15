import { IReview } from "./review.interface";
import review from "./review.model";

const createReview = async (payload: IReview) => {
  const result = await review.create(payload);
  return result;
};

const getAllReviews = async (
  page: number = 1,
  limit: number = 10,
  status: string = "all",
  rating?: number
): Promise<any> => {
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (status !== "all") filter.status = status;
  if (rating) filter.rating = rating;

  const reviews = await review
    .find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await review.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  const ratingCounts = await review.aggregate([
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    },
  ]);

  const reviewCount: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingCounts.forEach((r) => {
    reviewCount[r._id] = r.count;
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    data: reviews,
    reviewCount,
  };
};

const getApprovedReviews = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const reviews = await review
    .find({ status: "approved" })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await review.countDocuments({ status: "approved" });
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
  getApprovedReviews,
  getSingleReview,
  deleteReview,
};

export default reviewService;
