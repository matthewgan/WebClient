export interface IShopInfo {
    id: number;
    name: string;
    longitude?: string;
    latitude?: string;
    city: string;
    locationDetail?: string;
    size: number;
    capacity?: number;
    createTime?: string;
    openingTime?: string;
}

export interface IShopCreateRequest {
    name: string;
    city: string;
    locationDetail?: string;
    size?: number;
}