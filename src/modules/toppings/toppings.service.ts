/* eslint-disable prefer-const */
import { uploadToCloudinary } from "../../utils/cloudinary";
import { ITopping } from "./toppings.interface";
import Toppings from "./toppings.model";

const createNewTopping = async (payload: ITopping, file: any) => {
  let imageData = {
    public_id: "",
    url: "",
  };

  if (file) {
    const uploadResult = await uploadToCloudinary(file.path, "toppings");
    imageData.public_id = uploadResult.public_id;
    imageData.url = uploadResult.secure_url;
  }

  const newTopping = await Toppings.create({
    name: payload.name,
    price: payload.price,
    category: payload.category,
    image: imageData,
  });

  return newTopping;
};

const getAllToppings = async () => {
  const toppings = await Toppings.find({ isAvailable: true });
  return toppings;
};

const getAllToppingsForAdmin = async (
  page = 1,
  limit = 10,
  category?: string
) => {
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (category) {
    filter.category = category;
  }

  const toppings = await Toppings.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const allCategories = await Toppings.distinct("category").then((cats) =>
    cats.filter(Boolean).sort()
  );

  const total = await Toppings.countDocuments(filter);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: toppings,
    allCategories,
  };
};


const toppingsService = {
  createNewTopping,
  getAllToppings,
  getAllToppingsForAdmin,
};

export default toppingsService;
