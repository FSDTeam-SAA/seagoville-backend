import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { Menu } from "../menu/menu.model";
import { ICart } from "./cart.interface";
import Cart from "./cart.model";

const menuAddToCart = async (payload: ICart, deviceIp: string) => {
  const { menu } = payload;

  // Find the menu by ID
  const menuItem = await Menu.findById(menu.menuId);
  if (!menuItem) {
    throw new AppError("Menu not found", StatusCodes.NOT_FOUND);
  }

  if (menuItem.isAvailable === false) {
    throw new AppError("Menu is not available", StatusCodes.BAD_REQUEST);
  }

  // Get the selected type price
  const selectedType = menu.types.toLowerCase();
  const price = menuItem.price[selectedType as keyof typeof menuItem.price];

  if (!price) {
    throw new AppError(
      `Price for type ${selectedType} not found`,
      StatusCodes.BAD_REQUEST
    );
  }

  // Create cart item
  const result = await Cart.create({
    menu: {
      menuId: menuItem._id,
      types: selectedType,
    },
    quantity: payload.quantity || 1,
    totalPrice: price * (payload.quantity || 1),
    deviceIp,
    type: "menu",
  });

  return result;
};

const getCart = async (deviceIp: string) => {
  const result = await Cart.find({ deviceIp })
    .select("-__v -createdAt -updatedAt")
    .populate({
      path: "menu.menuId",
      select: "name category images",
    })
    .populate({
      path: "ownPizzaId",
      select: "size crust sauce cheese toppings totalPrice", // select fields you want
      populate: [
        { path: "size", select: "name price" },
        { path: "crust", select: "name price" },
        { path: "sauce", select: "name price" },
        { path: "cheese", select: "name price" },
        { path: "toppings.toppingId", select: "name price category" },
      ],
    });

  return result;
};

const incrementQuantity = async (deviceIp: string, cartId: string) => {
  const cartItem = await Cart.findOne({ _id: cartId, deviceIp });
  if (!cartItem) {
    throw new AppError("Cart item not found", StatusCodes.NOT_FOUND);
  }

  const unitPrice = cartItem.totalPrice / cartItem.quantity;

  const updatedCart = await Cart.findOneAndUpdate(
    { _id: cartId, deviceIp },
    {
      $inc: {
        quantity: 1,
        totalPrice: unitPrice,
      },
    },
    { new: true }
  );

  return updatedCart;
};

const decrementQuantity = async (deviceIp: string, cartId: string) => {
  const cartItem = await Cart.findOne({ _id: cartId, deviceIp });
  if (!cartItem) {
    throw new AppError("Cart item not found", StatusCodes.NOT_FOUND);
  }

  const unitPrice = cartItem.totalPrice / cartItem.quantity;

  const updatedCart = await Cart.findOneAndUpdate(
    { _id: cartId, deviceIp },
    {
      $inc: {
        quantity: -1,
        totalPrice: -unitPrice,
      },
    },
    { new: true }
  );

  return updatedCart;
};

const deleteCart = async (deviceIp: string, cartId: string) => {
  const cartItem = await Cart.findOne({ _id: cartId, deviceIp });
  if (!cartItem) {
    throw new AppError("Cart item not found", StatusCodes.NOT_FOUND);
  }

  await Cart.deleteOne({ _id: cartId, deviceIp });
};

const cartService = {
  menuAddToCart,
  getCart,
  incrementQuantity,
  decrementQuantity,
  deleteCart,
};

export default cartService;
