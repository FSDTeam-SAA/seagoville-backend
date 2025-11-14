import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import toppingsService from "./toppings.service";

const createNewTopping = catchAsync(async (req, res) => {
  const result = await toppingsService.createNewTopping(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Topping created successfully",
    data: result,
  });
});

const toppingsController = {
  createNewTopping,
};

export default toppingsController;
