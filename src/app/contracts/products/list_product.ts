import { Category_List } from "./categories/category_list";
import { List_Product_Image } from "./list_product_image";

export class List_Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  createdDate: Date;
  updatedDate: Date;
  productImageFiles: List_Product_Image[];
  imagePath: string;
  categories: Category_List[];
  salerUsername: string;
}
