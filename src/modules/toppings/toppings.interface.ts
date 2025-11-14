export interface ITopping {
  name: string;
  category: string;
  price: number;
  image: {
    public_id: string;
    url: string;
  };
}
