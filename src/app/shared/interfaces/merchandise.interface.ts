export interface IMerchandiseInfo {
    id: number;
    name: string;
    brand?: string;
    scale?: string;
    unit?: string;
    producePlace?: string;
    originPrice?: string;
    promotionPrice?: string;
    clubPrice: string;
    code?: string;
    picture: string;
    barcode: string;
    flavor?: string;
    factory?: string;
}

export class MerchandiseCreateRequest {
    code: string;
    barcode: string;
    categoryID: number;
    name: string;
    brand: string;
    scale: string;
    factory: string;
    unit: string;
}

export class MerchandiseQuery {
    barcode: string;
}
