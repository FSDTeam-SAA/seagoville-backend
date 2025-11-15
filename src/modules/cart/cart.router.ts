import { Router } from "express";
import cartController from "./cart.controller";

const router = Router();

router.post("/add-to-cart", cartController.menuAddToCart);

router.get("/get-cart", cartController.getCart);

const cartRouter = router;
export default cartRouter;
