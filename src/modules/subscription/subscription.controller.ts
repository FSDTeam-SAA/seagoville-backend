import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import subscriptionService from "./subscription.service";

const createSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.createSubscription(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Subscription created successfully",
    data: result,
  });
});

const getAllSubscriptions = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await subscriptionService.getAllSubscriptions(page, limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Subscriptions fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const deletedSubscription = catchAsync(async (req, res) => {
  const { subscriptionId } = req.params;
  await subscriptionService.deleteSubscription(subscriptionId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Subscription deleted successfully",
  });
});

const subscriptionController = {
  createSubscription,
  getAllSubscriptions,
  deletedSubscription,
};

export default subscriptionController;
