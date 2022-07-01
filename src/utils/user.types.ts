export interface UserDetails {
    username: string;
    lat: string;
    long: string;
    name: string;
    avatar: string;
    average_review: number;
}

export interface LoginUser {
    username: string;
    password: string;
}

export interface CreatingUser {
    username: string;
    postcode: string;
    name: string;
    avatar: string;
    password: string;
}