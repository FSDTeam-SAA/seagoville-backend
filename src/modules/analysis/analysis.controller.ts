import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import analysisService from "./analysis.service";

const toppingsAnalysis = catchAsync(async (req, res) => {
  const result = await analysisService.toppingsAnalysis();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Toppings fetched successfully",
    data: result,
  });
});



const analysisController = {
  toppingsAnalysis,
};

export default analysisController;