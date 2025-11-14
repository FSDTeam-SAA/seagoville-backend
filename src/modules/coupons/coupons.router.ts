import { Router } from "express";
import couponController from "./coupons.controller";

const router = Router();

router.post("/new-coupon", couponController.createCoupon);
router.get("/", couponController.getAllCoupons);
router.get("/all-coupons", couponController.getAllCouponsForAdmin);

router.get("/:couponId", couponController.getSingleCoupon);

router.put("/update-coupon/:couponId", couponController.updateCoupon);

router.delete("/delete-coupon/:couponId", couponController.deleteCoupon);

const couponsRouter = router;
export default couponsRouter;
