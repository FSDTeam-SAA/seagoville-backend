import { Router } from "express";
import paymentController from "./payment.controller";

const router = Router();

router.post("/new-payment", paymentController.createPayment);

const paymentRouter = router;
export default paymentRouter;
