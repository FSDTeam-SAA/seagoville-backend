import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import toppingsService from "./toppings.service";

const createNewTopping = catchAsync(async (req, res) => {
  const result = await toppingsService.createNewTopping(req.body, req.file);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Topping created successfully",
    data: result,
  });
});

const getAllToppings = catchAsync(async (req, res) => {
  const result = await toppingsService.getAllToppings();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Toppings fetched successfully",
    data: result,
  });
});

const getAllToppingsForAdmin = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const category = req.query.category as string;

  const result = await toppingsService.getAllToppingsForAdmin(
    page,
    limit,
    category
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Toppings fetched successfully",
    meta: result.meta,
    data: result.data,
    allCategories: result.allCategories,
  });
});

const toppingsController = {
  createNewTopping,
  getAllToppings,
  getAllToppingsForAdmin,
};

export default toppingsController;
