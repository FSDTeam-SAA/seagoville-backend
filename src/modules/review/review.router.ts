import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import reviewController from "./review.controller";

const router = Router();

router.post("/new-review", reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/approved-reviews", reviewController.getApprovedReviews);
router.get("/:reviewId", reviewController.getSingleReview);

router.put("/toggle-status/:reviewId", reviewController.toggleReviewStatus);
router.delete(
  "/delete-review/:reviewId",
  auth(USER_ROLE.ADMIN),
  reviewController.deleteReview
);

const reviewRouter = router;
export default reviewRouter;
