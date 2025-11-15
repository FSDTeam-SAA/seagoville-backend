import { Types } from "mongoose";

export interface ICart {
  menu: {
    menuId: Types.ObjectId;
    types: string;
  };
  ownPizzaId: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  deviceIp: string;
  type: string;
}
