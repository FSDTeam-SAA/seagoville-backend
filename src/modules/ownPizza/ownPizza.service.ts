import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import Toppings from "../toppings/toppings.model";
import { IOwnPizza } from "./ownPizza.interface";
import ownPizza from "./ownPizza.model";

const createOwnPizza = async (payload: IOwnPizza, deviceIp: string) => {
  const { size, crust, sauce, cheese, toppings } = payload;

  const sizeExists = await Toppings.findOne({ _id: size, category: "size" });
  if (!sizeExists) {
    throw new AppError("Size not found", StatusCodes.NOT_FOUND);
  }

  const crustExists = await Toppings.findOne({ _id: crust, category: "crust" });
  if (!crustExists) {
    throw new AppError("Crust not found", StatusCodes.NOT_FOUND);
  }

  const sauceExists = await Toppings.findOne({ _id: sauce, category: "sauce" });
  if (!sauceExists) {
    throw new AppError("Sauce not found", StatusCodes.NOT_FOUND);
  }

  const cheeseExists = await Toppings.findOne({
    _id: cheese,
    category: "cheese",
  });
  if (!cheeseExists) {
    throw new AppError("Cheese not found", StatusCodes.NOT_FOUND);
  }

  let toppingsPrice = 0;

  for (let i = 0; i < toppings.length; i++) {
    const { toppingId, category } = toppings[i];

    const toppingExists = await Toppings.findOne({
      _id: toppingId,
      category: category,
    });

    if (!toppingExists) {
      throw new AppError(
        `${toppingExists!.category} not found`,
        StatusCodes.NOT_FOUND
      );
    }

    toppingsPrice += toppingExists.price;
  }

  const price =
    sizeExists.price +
    crustExists.price +
    sauceExists.price +
    cheeseExists.price +
    toppingsPrice;

  const result = await ownPizza.create({
    size,
    crust,
    sauce,
    cheese,
    toppings,
    totalPrice: price,
    deviceIp,
  });

  return result;
};

const getAllOwnPizzas = async (deviceIp: string) => {
  const result = await ownPizza
    .find({ deviceIp })
    .populate("size")
    .populate("crust")
    .populate("sauce")
    .populate("cheese")
    .populate("toppings.toppingId");
  return result;
};

const ownPizzaService = {
  createOwnPizza,
  getAllOwnPizzas,
};

export default ownPizzaService;
