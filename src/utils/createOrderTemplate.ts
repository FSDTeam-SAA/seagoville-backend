import { companyName } from "../lib/globalType";

interface IOrderEmail {
  orderId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
  finalPrice: number;
  createdAt: Date;
}

const createOrderTemplate = (order: IOrderEmail): string => {
  return `
    <div style="max-width:600px;margin:auto;font-family:Arial,Helvetica,sans-serif;background:#ffffff;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.1);padding:20px;">
      
      <div style="text-align:center;padding:15px 0;">
        <h2 style="margin:10px 0;color:#333;">New Order Received</h2>
      </div>

      <p style="font-size:16px;color:#444;">
        Hi Admin,
      </p>

      <p style="font-size:15px;color:#555;line-height:1.7;">
        A new order <strong>#${order.orderId}</strong> has been placed.
      </p>

      <p style="font-size:15px;color:#555;line-height:1.7;">
        <strong>Customer:</strong> ${order.fullName}<br>
        <strong>Email:</strong> ${order.email}<br>
        <strong>Phone:</strong> ${order.phone}<br>
        <strong>Address:</strong> ${order.address}<br>
        ${order.note ? `<strong>Note:</strong> ${order.note}<br>` : ""}
        <strong>Total Payment:</strong> $${order.finalPrice.toFixed(2)}<br>
        <strong>Order Time:</strong> ${order.createdAt.toLocaleString()}
      </p>

      <p style="font-size:14px;color:#777;margin-top:20px;">
        Please process the order promptly. Thank you for using <strong>${companyName}</strong>! 🍕
      </p>

      <hr style="border:none;border-top:1px solid #eee;margin:25px 0;">

      <p style="font-size:13px;color:#aaa;text-align:center;">
        This is an automated email. For support, contact the system administrator.
      </p>
    </div>
  `;
};

export default createOrderTemplate;
