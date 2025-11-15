export interface IReview {
  rating: number;
  name: string;
  comment: string;
  status: "approved" | "pending" | "rejected";
}
