import { Router } from "express";
import orderController from "./order.controller";

const router = Router();

router.post("/new-order", orderController.createOrder);
router.get("/", orderController.getMyOrders);

router.get("/all-orders", orderController.getAllOrders);
router.get("/:orderId", orderController.getSingleOrder);
router.put("/toggle-status/:orderId", orderController.toggleOrderStatus);

const orderRouter = router;
export default orderRouter;
