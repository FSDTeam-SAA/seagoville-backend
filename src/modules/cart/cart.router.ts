import { Router } from "express";
import cartController from "./cart.controller";

const router = Router();

router.post("/add-to-cart", cartController.menuAddToCart);
router.get("/get-cart", cartController.getCart);

router.put("/increment/:cartId", cartController.incrementQuantity);
router.put("/decrement/:cartId", cartController.decrementQuantity);

router.delete("/delete/:cartId", cartController.deleteCart);

const cartRouter = router;
export default cartRouter;
