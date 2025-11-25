export interface IMenu {
  name: string;
  category: string;
  description: string;
  images: {
    public_id: string;
    url: string;
  }[];
  sizes?: string[];
  pieces?: number[];
  price: number[];
  isAvailable: boolean;
  totalSold: number;
  ingredients: string[];
}
