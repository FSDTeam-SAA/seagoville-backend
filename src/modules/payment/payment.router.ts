import { Router } from "express";
import paymentController from "./payment.controller";

const router = Router();

router.post("/new-payment", paymentController.createPayment);
router.post("/confirm-payment", paymentController.confirmPayment);

router.get("/all-payments", paymentController.getAllPayments);

const paymentRouter = router;
export default paymentRouter;
