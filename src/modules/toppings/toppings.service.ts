/* eslint-disable prefer-const */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary";
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
    description: payload.description,
  });

  return newTopping;
};

const getAllToppings = async (category?: string, toppingCategory?: string) => {
  const mainCategories = ["size", "crust", "sauce", "cheese"];

  // CASE-1 → Filtering by main category
  if (category && category !== "toppings") {
    if (mainCategories.includes(category)) {
      return {
        categories: [],
        data: await Toppings.find({
          isAvailable: true,
          category: category,
        }),
      };
    }

    // Filter only specific topping category (Veg / Non-Veg / Spicy)
    return {
      categories: [category],
      data: await Toppings.find({
        isAvailable: true,
        category: category,
      }),
    };
  }

  // CASE-2 → Filtering by "toppings"
  let data = await Toppings.find({
    isAvailable: true,
    category: { $nin: mainCategories },
  });

  // Collect unique topping categories
  const categories = [...new Set(data.map((item) => item.category))];

  // CASE-2a → Second-level filter by toppingCategory
  if (toppingCategory) {
    data = data.filter((item) => item.category === toppingCategory);
  }

  return {
    categories,
    data,
  };
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

const getSingleTopping = async (id: string) => {
  const isToppingExists = await Toppings.findOne({ _id: id });
  if (!isToppingExists) {
    throw new Error("Topping not found");
  }

  const result = await Toppings.findOne({ _id: id, isAvailable: true });
  return result;
};

const toggleToppingStatus = async (id: string) => {
  const isToppingExists = await Toppings.findOne({ _id: id });
  if (!isToppingExists) {
    throw new Error("Topping not found");
  }

  const result = await Toppings.findOneAndUpdate(
    { _id: id },
    [{ $set: { isAvailable: { $not: "$isAvailable" } } }],
    { new: true }
  );
  return result;
};

const updateTopping = async (id: string, payload: ITopping, file: any) => {
  let imageData = {
    public_id: "",
    url: "",
  };

  if (file) {
    const uploadResult = await uploadToCloudinary(file.path, "toppings");
    imageData.public_id = uploadResult.public_id;
    imageData.url = uploadResult.secure_url;

    if (payload.image && payload.image.public_id) {
      await deleteFromCloudinary(payload.image.public_id);
    }
  }

  const result = await Toppings.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: payload.name,
        price: payload.price,
        category: payload.category,
        image: imageData,
        description: payload.description,
      },
    },
    { new: true }
  );
  return result;
};

const deleteTopping = async (id: string) => {
  const isToppingExists = await Toppings.findOne({ _id: id });
  if (!isToppingExists) {
    throw new Error("Topping not found");
  }

  if (isToppingExists.isAvailable === true) {
    throw new AppError("Topping is available", StatusCodes.BAD_REQUEST);
  }

  await Toppings.findOneAndDelete({ _id: id });
};

const toppingsService = {
  createNewTopping,
  getAllToppings,
  getAllToppingsForAdmin,
  toggleToppingStatus,
  getSingleTopping,
  updateTopping,
  deleteTopping,
};

export default toppingsService;
