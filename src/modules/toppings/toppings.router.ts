import { Router } from "express";
import { upload } from "../../middleware/multer.middleware";
import toppingsController from "./toppings.controller";

const router = Router();

router.post(
  "/new-topping",
  upload.single("image"),
  toppingsController.createNewTopping
);

router.get("/", toppingsController.getAllToppings);
router.get("/all-toppings", toppingsController.getAllToppingsForAdmin);

const toppingsRouter = router;
export default toppingsRouter;
