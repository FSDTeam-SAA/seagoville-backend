import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import couponService from "./coupons.service";

const createCoupon = catchAsync(async (req, res) => {
  const result = await couponService.createCoupon(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon created successfully",
    data: result,
  });
});

const getAllCoupons = catchAsync(async (req, res) => {
  const result = await couponService.getAllCoupons();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupons fetched successfully",
    data: result,
  });
});

const getAllCouponsForAdmin = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await couponService.getAllCouponsForAdmin(page, limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupons fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCoupon = catchAsync(async (req, res) => {
  const { couponId } = req.params;
  const result = await couponService.getSingleCoupon(couponId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon get successfully",
    data: result,
  });
});

const updateCoupon = catchAsync(async (req, res) => {
  const { couponId } = req.params;
  const result = await couponService.updateCoupon(couponId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon updated successfully",
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req, res) => {
  const { couponId } = req.params;
  await couponService.deleteCoupon(couponId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon deleted successfully",
  });
});

const couponController = {
  createCoupon,
  getAllCoupons,
  getAllCouponsForAdmin,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
};

export default couponController;
