import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import {
    IStockInfo,
    IStockInRequest,
    StockOutRequest,
    IStockQuery,
    StockTransferRequest } from 'src/app/shared/interfaces/stock.interface';
import { environment } from 'src/environments/environment';
import { EventBusService, EmitEvent, Events } from './event-bus.service';

@Injectable()
export class InventoryService {

    stock_url = environment.apiUrl + '/api/stock/';
    shopStockinfos: IStockInfo[];
    merchandiseStockinfos: IStockInfo[];

    constructor(
      private http: HttpClient,
      private eventBus: EventBusService
      ) {}

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

    queryStockByShopfromEvent(shopID: number) {
      this.queryStockByShop(shopID).subscribe(infos => {
        this.shopStockinfos = infos;
        this.eventBus.emit(new EmitEvent(Events.ShopStockFound, this.shopStockinfos));
      });
    }

    queryStockByMerchandise(merchandise_id: number) {
        const query_url = this.stock_url + 'merchandise/';
        return this.http.get<IStockInfo[]>(`${query_url}${merchandise_id}/`);
    }

    queryStockByMerchandiseFromEvent(merchandiseID: number) {
      this.queryStockByMerchandise(merchandiseID).subscribe(infos => {
        this.merchandiseStockinfos = infos;
        this.eventBus.emit(new EmitEvent(Events.MerchandiseStockFound, this.merchandiseStockinfos));
      });
    }
}
