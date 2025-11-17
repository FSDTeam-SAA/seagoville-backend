import express from "express";
import {
  getAllNotifications,
  markAllAsRead,
} from "./notification.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", auth("admin"), getAllNotifications);
router.patch("/read/all", markAllAsRead);

const notificationRouter = router;
export default notificationRouter;
