import Subscription from "./subscription.model";

const createSubscription = async (payload: any) => {
  const result = await Subscription.create(payload);
  return result;
};

const getAllSubscriptions = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const subscriptions = await Subscription.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Subscription.countDocuments();
  const totalPages = Math.ceil(total / limit);
  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    data: subscriptions,
  };
};

const deleteSubscription = async (id: string) => {
  const isSubscriptionExist = await Subscription.findById(id);
  if (!isSubscriptionExist) {
    throw new Error("Subscription not found");
  }

  await Subscription.findByIdAndDelete(id);
};

const subscriptionService = {
  createSubscription,
  getAllSubscriptions,
  deleteSubscription,
};

export default subscriptionService;
