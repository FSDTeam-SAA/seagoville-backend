import { Router } from "express";
import analysisRouter from "../modules/analysis/analysis.router";
import authRouter from "../modules/auth/auth.router";
import contactRouter from "../modules/contact/contact.router";
import couponsRouter from "../modules/coupons/coupons.router";
import menuRouter from "../modules/menu/menu.route";
import ownPizzaRouter from "../modules/ownPizza/ownPizza.router";
import reviewRouter from "../modules/review/review.router";
import subscriptionRouter from "../modules/subscription/subscription.router";
import toppingsRouter from "../modules/toppings/toppings.router";
import userRouter from "../modules/user/user.router";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/contact",
    route: contactRouter,
  },
  {
    path: "/menu",
    route: menuRouter,
  },
  {
    path: "/coupons",
    route: couponsRouter,
  },
  {
    path: "/review",
    route: reviewRouter,
  },
  {
    path: "/subscription",
    route: subscriptionRouter,
  },
  {
    path: "/toppings",
    route: toppingsRouter,
  },
  {
    path: "/analysis",
    route: analysisRouter,
  },
  {
    path: "/own-pizza",
    route: ownPizzaRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
