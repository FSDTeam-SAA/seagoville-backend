import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import menuService from "./menu.service";

const createMenu = catchAsync(async (req, res) => {
  const files: any = req.files;
  const result = await menuService.createMenu(req.body, files);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Menu created successfully",
    data: result,
  });
});

const getAllMenus = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;

  const result = await menuService.getAllMenus({
    page: Number(page),
    limit: Number(limit),
    category: category as string,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Menus fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMenuById = catchAsync(async (req, res) => {
  const { menuId } = req.params;
  const result = await menuService.getMenuById(menuId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Menu fetched successfully",
    data: result,
  });
});

const updateMenu = catchAsync(async (req, res) => {
  const { menuId } = req.params;
  const files: any = req.files;
  const result = await menuService.updateMenu(menuId, req.body, files);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Menu updated successfully",
    data: result,
  });
});

const deleteMenu = catchAsync(async (req, res) => {
  const { menuId } = req.params;
  await menuService.deleteMenu(menuId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Menu deleted successfully",
  });
});

const menuController = {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
};

export default menuController;
