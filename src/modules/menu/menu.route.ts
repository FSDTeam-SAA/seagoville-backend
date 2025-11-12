import { Router } from "express";
import { upload } from "../../middleware/multer.middleware";
import menuController from "./menu.controller";

const router = Router();

router.post("/new-menu", upload.array("images", 10), menuController.createMenu);

router.get("/all-menus", menuController.getAllMenus);

router.get("/:menuId", menuController.getMenuById);

const menuRouter = router;
export default menuRouter;
