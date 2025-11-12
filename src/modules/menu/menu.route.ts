import { Router } from "express";
import menuController from "./menu.controller";

const router = Router();

router.post("/new-menu", menuController.createMenu);

const menuRouter = router;
export default menuRouter;
