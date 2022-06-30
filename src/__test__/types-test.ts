export interface Category {
  category: string;
  category_id: number;
}

export interface Category {
  category: string;
  category_id: number;
}

export interface Item {
  name: string;
  price: number;
  body: string;
  user_id: number;
  category_id: number;
  item_image: string;
  created_at: Date;
  is_available: boolean;
  lat: number;
  long: number;
}

export type Comment = {
  created_at: Date;
  user_id: number;
  body: string;
  item_id: number;
};
