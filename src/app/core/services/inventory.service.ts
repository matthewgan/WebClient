import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
    IStockInfo,
    IStockInRequest,
    StockOutRequest,
    IStockQuery,
    StockTransferRequest } from 'src/app/shared/interfaces/stock.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class InventoryService {

    stock_url = environment.apiUrl + '/api/stock/';

    constructor(private http: HttpClient) {}

    inStock(record: IStockInRequest) {
        return this.http.post(this.stock_url + 'in/', record);
    }

    outStock(record: StockOutRequest) {
        return this.http.post(this.stock_url + 'out/', record);
    }

    queryStock(info: IStockQuery) {
        return this.http.post(this.stock_url + 'query/', info);
    }

    transferStock(info: StockTransferRequest) {
        return this.http.post(this.stock_url + 'transfer/', info);
    }

    queryStockByShop(shop_id: number) {
        const query_url = this.stock_url + 'shop/';
        return this.http.get<IStockInfo[]>(`${query_url}${shop_id}/`);
    }

    queryStockByMerchandise(merchandise_id: number) {
        const query_url = this.stock_url + 'merchandise/';
        return this.http.get<IStockInfo[]>(`${query_url}${merchandise_id}/`);
    }
}
