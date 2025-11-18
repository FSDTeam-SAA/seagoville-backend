import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import ownPizzaService from "./ownPizza.service";

const createOwnPizza = catchAsync(async (req, res) => {
  const forwardedFor = req.headers["x-forwarded-for"];

  const deviceIp =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0].trim()
      : Array.isArray(forwardedFor)
      ? forwardedFor[0].split(",")[0].trim()
      : req.ip || "unknown";

  const result = await ownPizzaService.createOwnPizza(req.body, deviceIp);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Own Pizza created successfully",
    data: result,
  });
});

const getAllOwnPizzas = catchAsync(async (req, res) => {
  const forwardedFor = req.headers["x-forwarded-for"];

  const deviceIp =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0].trim()
      : Array.isArray(forwardedFor)
      ? forwardedFor[0].split(",")[0].trim()
      : req.ip || "unknown";

  const result = await ownPizzaService.getAllOwnPizzas(deviceIp);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Own Pizzas fetched successfully",
    data: result,
  });
});

const ownPizzaController = {
  createOwnPizza,
  getAllOwnPizzas,
};

export default ownPizzaController;
