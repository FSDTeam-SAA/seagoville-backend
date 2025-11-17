import { Coupon } from "../coupons/coupons.model";
import Payment from "../payment/payment.model";
import review from "../review/review.model";
import Toppings from "../toppings/toppings.model";

const toppingsAnalysis = async () => {
  const totalToppings = await Toppings.countDocuments();
  const availableToppings = await Toppings.countDocuments({
    isAvailable: true,
  });

  const outOfStockToppings = await Toppings.countDocuments({
    isAvailable: false,
  });

  const categoriesCount = await Toppings.distinct("category").then(
    (cats) => cats.length
  );

  return {
    totalToppings,
    availableToppings,
    outOfStockToppings,
    categoriesCount,
  };
};

const getReviewAnalysis = async () => {
  const totalReviews = await review.countDocuments();
  const pendingReviews = await review.countDocuments({ status: "pending" });
  const approvedReview = await review.countDocuments({ status: "approved" });
  const averageRating = await review
    .aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ])
    .then((result) => result[0]?.averageRating || 0);

  return Promise.all([
    totalReviews,
    pendingReviews,
    approvedReview,
    averageRating,
  ]);
};

const couponsAnalysis = async () => {
  const totalCoupons = await Coupon.countDocuments();
  const activeCoupons = await Coupon.countDocuments({
    isActive: true,
  });

  const totalUses = await Coupon.aggregate([
    {
      $group: {
        _id: null,
        totalUses: { $sum: "$timesUsed" },
      },
    },
  ]);

  return {
    totalCoupons,
    activeCoupons,
    totalUses: totalUses[0]?.totalUses || 0,
  };
};

const paymentAnalysis = async () => {
  const totalRevenueAgg = await Payment.aggregate([
    {
      $match: { status: "success" }, 
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

  const totalTransactions = await Payment.countDocuments({ status: "success" });

  return {
    totalRevenue,
    totalTransactions,
  };
};


const analysisService = {
  toppingsAnalysis,
  getReviewAnalysis,
  couponsAnalysis,
  paymentAnalysis,
};

export default analysisService;
