import { Types } from "mongoose";

export interface IOrder {
  type: "single" | "multi";
  productId?: string;
  deviceIp: string;
  cart: {
    cartId: Types.ObjectId;
    quantity: number;
    totalPrice: number;
    size: string;
  }[];
  couponCode: string;
  size: string;
  finalPrice: number;
  status: "pending" | "delivered" | "cancelled";
  deliveryDetails: {
    fullName: string;
    email: string;
    address: string;
    phone: string;
    note: string;
  };
}
