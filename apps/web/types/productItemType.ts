export interface ProductItemType {
  id: number;
  color_main_image: string;
  name: string;
  price: number;
}

export interface ProductAdminType {
  id: number;
  color_main_image: string;
  color_detail_image: string;
  name: string;
  price: number;
  brand: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  hash_tag: string[];
}
