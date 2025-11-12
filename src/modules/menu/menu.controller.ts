import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import menuService from "./menu.service";

const createMenu = catchAsync(async (req, res) => {
  const result = await menuService.createMenu(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Menu created successfully",
    data: result,
  });
});

const menuController = {
  createMenu,
};

export default menuController;