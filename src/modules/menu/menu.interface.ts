export interface IMenu {
  name: string;
  category: string;
  description: string;
  images: {
    public_id: string;
    url: string;
  };
  price: {
    small: number;
    medium: number;
    large: number;
  };
}
