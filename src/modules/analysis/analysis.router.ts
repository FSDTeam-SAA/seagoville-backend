import { Router } from "express";
import analysisController from "./analysis.controller";

const router = Router();

router.get("/toppings", analysisController.toppingsAnalysis);
router.get("/reviews", analysisController.getReviewAnalysis);
router.get("/coupons", analysisController.couponsAnalysis);

const analysisRouter = router;
export default analysisRouter;
