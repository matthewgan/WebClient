export interface IStockInfo {
    id: number;
    shopID: number;
    merchandiseID: number;
    number: number;
    supplierID: number;
    created: string;
    updated: string;
}

export interface IStockQuery {
    shopID: number;
    merchandiseID: number;
}

export interface IStockInRequest {
    shopID: number;
    merchandiseID: number;
    number: number;
    supplierID: number;
    operator: number;
}

export class StockOutRequest {
    shopID: number;
    merchandiseID: number;
    number: number;
    operator: number;
}

export class StockTransferRequest {
    fromShop: number;
    toShop: number;
    merchandiseID: number;
    number: number;
    operator: number;
}
