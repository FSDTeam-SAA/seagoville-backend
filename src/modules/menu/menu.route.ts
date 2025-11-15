import { Router } from "express";
import { upload } from "../../middleware/multer.middleware";
import menuController from "./menu.controller";

const router = Router();

router.post("/new-menu", upload.array("images", 10), menuController.createMenu);

router.get("/all-menus", menuController.getAllMenus);

router.get("/all", menuController.getAllMenusForAdmin);
router.get("/:menuId", menuController.getMenuById);

router.put(
  "/update-menu/:menuId",
  upload.array("images", 10),
  menuController.updateMenu
);

router.put("/toggle-status/:menuId", menuController.toggleMenuStatus);

router.delete("/delete-menu/:menuId", menuController.deleteMenu);

const menuRouter = router;
export default menuRouter;
