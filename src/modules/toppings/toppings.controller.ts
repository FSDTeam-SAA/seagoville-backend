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
  const { category, toppingCategory } = req.query;

  const result = await toppingsService.getAllToppings(
    category as string,
    toppingCategory as string
  );

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

const getSingleTopping = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await toppingsService.getSingleTopping(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Topping get successfully",
    data: result,
  });
});

const toggleToppingStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await toppingsService.toggleToppingStatus(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Topping status toggled successfully",
    data: result,
  });
});

const updateTopping = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await toppingsService.updateTopping(id, req.body, req.file);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Topping updated successfully",
    data: result,
  });
});

const deleteTopping = catchAsync(async (req, res) => {
  const { id } = req.params;
  await toppingsService.deleteTopping(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Topping deleted successfully",
  });
});

const toppingsController = {
  createNewTopping,
  getAllToppings,
  getAllToppingsForAdmin,
  getSingleTopping,
  toggleToppingStatus,
  updateTopping,
  deleteTopping,
};

export default toppingsController;
