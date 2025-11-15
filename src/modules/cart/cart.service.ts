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


const cartService = {
  menuAddToCart,
  getCart,
};

export default cartService;



// const getCart = async (deviceIp: string) => {
//   let result = await Cart.find({ deviceIp })
//     .select("-__v -createdAt -updatedAt")
//     .populate({
//       path: "menu.menuId",
//       select: "name price category description images",
//     })
//     .populate({
//       path: "ownPizzaId",
//       select: "size crust sauce cheese toppings totalPrice",
//       populate: [
//         { path: "size", select: "name price" },
//         { path: "crust", select: "name price" },
//         { path: "sauce", select: "name price" },
//         { path: "cheese", select: "name price" },
//         { path: "toppings.toppingId", select: "name price category" },
//       ],
//     })
//     .lean();

//   // Transform menu price to only selected type and convert ObjectId to string
//   const cartItems = result.map((cartItem: any) => {
//     // Convert main _id to string
//     cartItem._id = cartItem._id.toString();

//     // ownPizzaId _id to string
//     if (cartItem.ownPizzaId) {
//       cartItem.ownPizzaId._id = cartItem.ownPizzaId._id.toString();

//       // convert nested toppings _id to string
//       if (cartItem.ownPizzaId.toppings) {
//         cartItem.ownPizzaId.toppings = cartItem.ownPizzaId.toppings.map(
//           (t: any) => {
//             t.toppingId._id = t.toppingId._id.toString();
//             return t;
//           }
//         );
//       }
//     }

//     // menu.menuId _id to string and keep only selected price
//     if (cartItem.menu && cartItem.menu.menuId) {
//       const type = cartItem.menu.types;
//       const menuDoc = cartItem.menu.menuId;
//       menuDoc._id = menuDoc._id.toString();
//       menuDoc.price = menuDoc.price[type]; // only selected type
//       cartItem.menu.menuId = menuDoc;
//     }

//     return cartItem;
//   });

//   return cartItems as CartItemWithPopulated[];
// };