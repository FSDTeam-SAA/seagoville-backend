import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { Menu } from "../menu/menu.model";
import ownPizza from "../ownPizza/ownPizza.model";
import { ICart } from "./cart.interface";
import Cart from "./cart.model";

const menuAddToCart = async (payload: ICart, deviceIp: string) => {
  const { menu, type, ownPizzaId } = payload;

  if (type === "menu") {
    const menuItem = await Menu.findById(menu.menuId);
    if (!menuItem) {
      throw new AppError("Menu not found", StatusCodes.NOT_FOUND);
    }

    if (!menu.types) {
      throw new AppError("Menu type is required", StatusCodes.BAD_REQUEST);
    }

    // Step 2: Check availability
    if (menuItem.isAvailable === false) {
      throw new AppError("Menu is not available", StatusCodes.BAD_REQUEST);
    }

    // Step 3: Make type lowercase (small/medium/large)
    const selectedType = menu.types.toLowerCase();

    // Step 4: Fetch price
    const price = menuItem.price[selectedType as keyof typeof menuItem.price];

    if (!price) {
      throw new AppError(
        `Price for type ${selectedType} not found`,
        StatusCodes.BAD_REQUEST
      );
    }

    // Step 5: Create Cart Item
    const quantity = payload.quantity || 1;

    const result = await Cart.create({
      menu: {
        menuId: menuItem._id,
        types: selectedType,
      },
      quantity,
      totalPrice: price * quantity,
      deviceIp,
      type: "menu",
    });

    return result;
  }

  if (type === "ownPizza") {
    const ownPizzaExists = await ownPizza.findById(ownPizzaId);
    if (!ownPizzaExists) {
      throw new AppError("Own pizza not found", StatusCodes.NOT_FOUND);
    }

    const quantity = payload.quantity || 1;

    const result = await Cart.create({
      ownPizzaId: ownPizzaExists._id,
      quantity,
      totalPrice: ownPizzaExists.totalPrice,
      deviceIp,
      type: "ownPizza",
    });

    return result;
  }

  throw new AppError("Invalid cart type", StatusCodes.BAD_REQUEST);
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
      select: "size crust sauce cheese toppings totalPrice isDelivered",
      populate: [
        { path: "size", select: "name price" },
        { path: "crust", select: "name price" },
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
