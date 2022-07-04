import { UserDetails } from "./user.types";

export interface ILocals {
    updatedSortBy?: string[];
    user: UserDetails;
}

export interface LocationSortedItem {
    item_id: number;
    name: string;
    price: number;
    body: string;
    user_id: number;
    category_id: number;
    item_image: string;
    created_at: Date;
    is_available: boolean;
    rating: number;
    lat: number;
    long: number;
    distance: number;
    [key: string]: any;
};