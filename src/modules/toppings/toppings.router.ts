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

router.get("/:id", toppingsController.getSingleTopping);
router.put("/toggle-status/:id", toppingsController.toggleToppingStatus);

router.put(
  "/update-topping/:id",
  upload.single("image"),
  toppingsController.updateTopping
);
router.delete("/delete/:id", toppingsController.deleteTopping);

const toppingsRouter = router;
export default toppingsRouter;
