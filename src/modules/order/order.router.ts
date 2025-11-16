import { Router } from "express";
import orderController from "./order.controller";

const router = Router();

router.post("/new-order", orderController.createOrder);
router.get("/", orderController.getMyOrders);

const orderRouter = router;
export default orderRouter;
