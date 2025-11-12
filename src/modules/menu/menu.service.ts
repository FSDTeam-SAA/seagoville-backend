import { IMenu } from "./menu.interface";
import { Menu } from "./menu.model";

const createMenu = async (payload: IMenu) => {
  const result = await Menu.create(payload);
  return result;
};

const menuService = {
  createMenu,
};

export default menuService;
