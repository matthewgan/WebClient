import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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
        return this.http.post(this.stock_url + 'in/', record, { observe: 'response' });
    }

    outStock(record: StockOutRequest) {
        return this.http.post(this.stock_url + 'out/', record, { observe: 'response' });
    }

    queryStock(info: IStockQuery) {
        return this.http.post(this.stock_url + 'query/', info, { observe: 'response' });
    }

    transferStock(info: StockTransferRequest) {
        return this.http.post(this.stock_url + 'transfer/', info, { observe: 'response' });
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
