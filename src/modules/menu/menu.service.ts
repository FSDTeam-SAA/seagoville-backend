import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary";
import { IMenu } from "./menu.interface";
import { Menu } from "./menu.model";

const createMenu = async (payload: IMenu, files: Express.Multer.File[]) => {
  let images: { public_id: string; url: string }[] = [];

  // ----- Handle file uploads -----
  if (files && files.length > 0) {
    const uploadPromises = files.map((file: Express.Multer.File) =>
      uploadToCloudinary(file.path, "menu")
    );
    const uploadedResults = await Promise.all(uploadPromises);

    images = uploadedResults.map((uploaded: any) => ({
      public_id: uploaded.public_id ?? "",
      url: uploaded.secure_url,
    }));

    // Delete old images if provided
    if (payload.images && payload.images.length > 0) {
      const oldImagesPublicIds = payload.images.map(
        (img) => img.public_id ?? ""
      );
      await Promise.all(
        oldImagesPublicIds.map((publicId) => deleteFromCloudinary(publicId))
      );
    }
  } else {
    images = (payload.images || []).map((img) => ({
      public_id: img.public_id ?? "",
      url: img.url ?? "",
    }));
  }

  const result = await Menu.create({
    ...payload,
    images,
  });

  return result;
};

const getAllMenus = async (query: {
  page: number;
  limit: number;
  category?: string;
}) => {
  const { page, limit, category } = query;

  const filter: any = {};
  if (category) {
    filter.category = { $regex: new RegExp(category, "i") }; // case-insensitive
  }

  const skip = (page - 1) * limit;

  const [menus, total] = await Promise.all([
    Menu.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Menu.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      total,
      page,
      totalPages,
      limit,
    },
    data: menus,
  };
};

const getMenuById = async (menuId: string) => {
  const isMenuExist = await Menu.findById(menuId);
  if (!isMenuExist) {
    throw new AppError("Menu not found", StatusCodes.NOT_FOUND);
  }

  const result = await Menu.findById(menuId);
  return result;
};

const menuService = {
  createMenu,
  getAllMenus,
  getMenuById,
};

export default menuService;
