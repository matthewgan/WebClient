export interface IMerchandiseInfo {
    id: number;
    code?: string;
    barcode: string;
    name: string;
    brand?: string;
    scale?: string;
    factory?: string;
    unit?: string;
    flavor?: string;
}

export interface IMerchandiseCreateRequest {
    code?: string;
    barcode: string;
    categoryID: number;
    name: string;
    brand?: string;
    scale?: string;
    factory?: string;
    unit?: string;
}
