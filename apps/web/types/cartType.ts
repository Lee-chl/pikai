interface Product {
  id: number;
  color_main_image: string;
  name: string;
}

interface DetailProduct {
  id: number;
  color_name: string;
  stock: number;
  product: Product;
}

interface CartItem {
  id: number;
  cart_id: number;
  quantity: number;
  is_selected: boolean;
  is_now: boolean;
  price: number;
  detailProduct: DetailProduct[];
}

interface User {
  name: string;
  postal_code: string;
  address: string;
  phone: string;
}

export interface Cart {
  id: number;
  cartItems: CartItem[];
  user: User;
}
