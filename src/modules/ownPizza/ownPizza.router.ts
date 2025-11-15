import { Router } from "express";
import ownPizzaController from "./ownPizza.controller";

const router = Router();

router.post("/create-new", ownPizzaController.createOwnPizza);

router.get("/", ownPizzaController.getAllOwnPizzas);

const ownPizzaRouter = router;
export default ownPizzaRouter;
