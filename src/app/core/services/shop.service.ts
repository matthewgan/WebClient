import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IShopInfo, IShopCreateRequest } from 'src/app/shared/interfaces/shop.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class ShopService {

  shop_url = environment.apiUrl + '/api/shop/';

  constructor(private http: HttpClient) { }

  list() {
      return this.http.get<IShopInfo[]>(this.shop_url);
  }

  add(store: IShopCreateRequest) {
    return this.http.post<IShopInfo>(this.shop_url + 'add/', store);
  }
}
