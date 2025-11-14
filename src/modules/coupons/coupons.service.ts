import { ICoupon } from "./coupons.interface";
import { Coupon } from "./coupons.model";

const createCoupon = async (payload: ICoupon) => {
  const result = await Coupon.create(payload);
  return result;
};

const getAllCoupons = async () => {
  const result = await Coupon.find({ isActive: true });
  return result;
};

const getAllCouponsForAdmin = async () => {
  const result = await Coupon.find();
  return result;
};

const getSingleCoupon = async (couponId: string) => {
  const isCouponExist = await Coupon.findById(couponId);
  if (!isCouponExist) {
    throw new Error("Coupon not found");
  }

  const result = await Coupon.findById(couponId);
  return result;
};

const updateCoupon = async (couponId: string, payload: ICoupon) => {
  const isCouponExist = await Coupon.findById(couponId);
  if (!isCouponExist) {
    throw new Error("Coupon not found");
  }

  const result = await Coupon.findByIdAndUpdate(couponId, payload, {
    new: true,
  });
  return result;
};

const deleteCoupon = async (couponId: string) => {
  const isCouponExist = await Coupon.findById(couponId);
  if (!isCouponExist) {
    throw new Error("Coupon not found");
  }

  //! I think there are some logic will be added if coupon is used and isActive

  await Coupon.findByIdAndDelete(couponId);
};

const couponService = {
  createCoupon,
  getAllCoupons,
  getAllCouponsForAdmin,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
};

export default couponService;
