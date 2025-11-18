import { companyName } from "../lib/globalType";

const getOrderStatusEmailTemplate = (
  fullName: string,
//   orderId: string,
  status: string,
  finalPrice: number,
  createdAt: Date
) => {
  // Status color
  const statusColor: Record<string, string> = {
    pending: "#ff9800",
    confirmed: "#2196f3",
    preparing: "#673ab7",
    delivering: "#009688",
    delivered: "#4caf50",
    cancelled: "#f44336",
    rejected: "#f44336",
  };

  const color = statusColor[status] || "#ff5722";

  // Format date
  const orderDate = new Date(createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `
  <div style="max-width:600px;margin:auto;font-family:Arial,Helvetica,sans-serif;background:#ffffff;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.1);padding:20px;">
      
      <div style="text-align:center;padding:10px 0;">
        <h2 style="margin:10px 0;color:#333;">Your Order Status Update</h2>
      </div>

      <p style="font-size:16px;color:#444;">
        Hi <strong>${fullName}</strong>,
      </p>

      <p style="font-size:15px;color:#555;line-height:1.7;">
        Your order has been updated to:
      </p>

      <div style="text-align:center;margin:20px 0;">
        <span style="background:${color};color:#fff;padding:10px 25px;border-radius:50px;font-size:18px;font-weight:bold;text-transform:capitalize;">
          ${status}
        </span>
      </div>

      <p style="font-size:15px;color:#555;line-height:1.7;">
        Total Payment: <strong>$${finalPrice}</strong>
      </p>

      <p style="font-size:15px;color:#555;line-height:1.7;">
        Order Time: <strong>${orderDate}</strong>
      </p>

      <p style="font-size:14px;color:#777;margin-top:20px;">
        Thank you for choosing <strong>${companyName}</strong>! 🍕  
      </p>

      <hr style="border:none;border-top:1px solid #eee;margin:25px 0;">

      <p style="font-size:13px;color:#aaa;text-align:center;">
        Need help? Reply to this email or contact support.
      </p>

  </div>
  `;
};

export default getOrderStatusEmailTemplate;
