export interface ICoupon {
  title: string;
  description: string;
  discountType: string;
  code: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  timesUsed: number;
}
