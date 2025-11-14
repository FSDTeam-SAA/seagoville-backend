import { Router } from "express";
import analysisController from "./analysis.controller";

const router = Router();

router.get("/toppings", analysisController.toppingsAnalysis);

const analysisRouter = router;
export default analysisRouter;
