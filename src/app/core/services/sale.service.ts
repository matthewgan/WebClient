import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ISaleInfo, ISalePagination } from 'src/app/shared/interfaces/sale.interface';
import { environment } from 'src/environments/environment';
import { Cacheable } from 'ngx-cacheable';
import { EventBusService, EmitEvent, Events } from './event-bus.service';


@Injectable()
export class SaleService {

    sale_url = environment.apiUrl + '/api/sale/';
    saleRecords: ISalePagination;
    shopSaleRecords: ISaleInfo[];

    constructor(
      private http: HttpClient,
      private eventBus: EventBusService
      ) {}

    @Cacheable()
    listAllSaleRecords() {
        return this.http.get<ISalePagination>(this.sale_url);
    }

    getlistAllSaleRecordsFromEvent() {
      this.listAllSaleRecords().subscribe(saleRecords => {
        this.saleRecords = saleRecords;
        this.eventBus.emit(new EmitEvent(Events.SaleRecordUpdated, this.saleRecords));
      });
    }

    getSaleRecordByPage(id: number) {
        const page_url = this.sale_url + '?page=';
        return this.http.get<ISalePagination>(`${page_url}${id}/`);
    }

    getSaleRecordByShop(shop_id: number) {
        const query_url = this.sale_url + 'shop/';
        return this.http.get<ISaleInfo[]>(`${query_url}${shop_id}/`);
    }
    getSaleRecordByShopFromEvent(shopID: number) {
      this.getSaleRecordByShop(shopID).subscribe(records => {
        this.shopSaleRecords = records;
        this.eventBus.emit(new EmitEvent(Events.ShopSaleRecordUpdated, this.shopSaleRecords));
      });
    }

    getSaleRecordByMerchandise(merchandise_id: number) {
        const query_url = this.sale_url + 'merchandise/';
        return this.http.get<ISaleInfo[]>(`${query_url}${merchandise_id}/`);
    }
}
