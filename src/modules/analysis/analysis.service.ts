import { Coupon } from "../coupons/coupons.model";
import { Menu } from "../menu/menu.model";
import Order from "../order/order.model";
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

const getDashboardAnalysis = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Get total orders for today
  const totalOrders = await Order.countDocuments();

  // Get total sales for today
  const todaySalesAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfToday, $lt: endOfToday },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$finalPrice" },
      },
    },
  ]);
  const todaySales = todaySalesAgg[0]?.totalSales || 0;

  // Get pending orders
  const pendingOrders = await Order.countDocuments({ status: "pending" });

  // Get the data from the previous day for comparison
  const startOfYesterday = new Date();
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0);

  const endOfYesterday = new Date();
  endOfYesterday.setDate(endOfYesterday.getDate() - 1);
  endOfYesterday.setHours(23, 59, 59, 999);

  // Get total orders for yesterday
  const totalOrdersYesterday = await Order.countDocuments({
    createdAt: { $gte: startOfYesterday, $lt: endOfYesterday },
  });

  // Get total sales for yesterday
  const yesterdaySalesAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYesterday, $lt: endOfYesterday },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$finalPrice" },
      },
    },
  ]);
  const yesterdaySales = yesterdaySalesAgg[0]?.totalSales || 0;

  // Get pending orders from yesterday
  const pendingOrdersYesterday = await Order.countDocuments({
    status: "pending",
  });

  // Calculate percentage changes
  const totalOrdersChange = totalOrdersYesterday
    ? ((totalOrders - totalOrdersYesterday) / totalOrdersYesterday) * 100
    : 0;
  const salesChange = yesterdaySales
    ? ((todaySales - yesterdaySales) / yesterdaySales) * 100
    : 0;
  const pendingOrdersChange = pendingOrdersYesterday
    ? ((pendingOrders - pendingOrdersYesterday) / pendingOrdersYesterday) * 100
    : 0;

  return {
    totalOrders,
    totalOrdersPercentChange: totalOrdersChange,
    todaySales,
    salesPercent: salesChange,
    pendingOrders,
    pendingOrdersPercent: pendingOrdersChange,
  };
};

const dashboardChart = async (year: number) => {
  // Start of year (UTC) to include all months properly
  const startOfYear = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
  const endOfYear = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0));

  const rawData = await Payment.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear, $lt: endOfYear },
        status: "success",
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        totalSales: { $sum: "$amount" },
        totalOrders: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        totalSales: 1,
        totalOrders: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);

  // Fill missing months
  const fullYear = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const found = rawData.find((m) => m.month === month);
    return {
      month,
      totalSales: found ? found.totalSales : 0,
      totalOrders: found ? found.totalOrders : 0,
    };
  });

  return fullYear;
};

const popularPizzas = async () => {
  const topMenus = await Menu.find({ isAvailable: true })
    .sort({ totalSold: -1 })
    .limit(5)
    .select("name totalSold")
    .lean();

  return topMenus;
};

const analysisService = {
  toppingsAnalysis,
  getReviewAnalysis,
  couponsAnalysis,
  paymentAnalysis,
  getDashboardAnalysis,
  dashboardChart,
  popularPizzas,
};

export default analysisService;
