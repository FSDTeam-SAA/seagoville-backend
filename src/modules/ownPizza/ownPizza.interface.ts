import { Types } from "mongoose";

export interface IOwnPizza {
  size: Types.ObjectId;
  crust: Types.ObjectId;
  sauce: Types.ObjectId;
  cheese: Types.ObjectId;
  toppings: {
    toppingId: string;
    category: string;
  }[];
  totalPrice: number;
  deviceIp: string;
}
