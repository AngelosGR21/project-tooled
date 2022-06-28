export type Data = {
  categoryData: CategoryData[];
  commentData: CommentData[];
  itemData: ItemData[];
  userData: UserData[];
  favouriteData: FavouriteData[];
};

export type CategoryData = {
  category: string;
};

export type CommentData = {
  created_at: Date;
  user_id: number;
  body: string;
  item_id: number;
};

export type ItemData = {
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
};

export type UserData = {
  username: string;
  name: string;
  avatar: string;
  lat: number;
  long: number;
  password: string;
};

export type FavouriteData = {
  user_id: number;
  item_id: number;
};
