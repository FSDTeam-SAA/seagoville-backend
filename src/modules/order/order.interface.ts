import { Types } from "mongoose";

export interface IOrder {
  deviceIp: string;
  cart: {
    cartId: Types.ObjectId;
    quantity: number;
    totalPrice: number;
  }[];
  couponCode: string;
  finalPrice: number;
  status: "pending" | "delivered" | "cancelled" 
  deliveryDetails: {
    fullName: string;
    email: string;
    address: string;
    phone: string;
    note: string;
  };
}
