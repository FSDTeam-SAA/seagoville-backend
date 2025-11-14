import { Router } from "express";
import subscriptionController from "./subscription.controller";

const router = Router();

router.post("/new-subscription", subscriptionController.createSubscription);
router.get("/", subscriptionController.getAllSubscriptions);

router.delete(
  "/delete-subscription/:subscriptionId",
  subscriptionController.deletedSubscription
);

const subscriptionRouter = router;
export default subscriptionRouter;
