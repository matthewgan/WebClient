import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ISaleInfo, ISalePagination } from 'src/app/shared/interfaces/sale.interface';
import { environment } from 'src/environments/environment';
import { Cacheable } from 'ngx-cacheable';


@Injectable()
export class SaleService {

    sale_url = environment.apiUrl + '/api/sale/';

    constructor(private http: HttpClient) {}

    @Cacheable()
    listAllSaleRecords() {
        return this.http.get<ISalePagination>(this.sale_url);
    }

    getSaleRecordByPage(id: number) {
        const page_url = this.sale_url + '?page=';
        return this.http.get<ISalePagination>(`${page_url}${id}/`);
    }

    getSaleRecordByShop(shop_id: number) {
        const query_url = this.sale_url + 'shop/';
        return this.http.get<ISaleInfo[]>(`${query_url}${shop_id}/`);
    }

    getSaleRecordByMerchandise(merchandise_id: number) {
        const query_url = this.sale_url + 'merchandise/';
        return this.http.get<ISaleInfo[]>(`${query_url}${merchandise_id}/`);
    }
}
