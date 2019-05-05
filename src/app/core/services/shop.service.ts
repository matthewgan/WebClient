import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Cacheable } from 'ngx-cacheable';

import { IShopInfo, ShopCreateRequest } from 'src/app/shared/interfaces/shop.interface';
import { environment } from 'src/environments/environment';
import { EventBusService, Events, EmitEvent } from './event-bus.service';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable()
export class ShopService {

  shop_url = environment.apiUrl + '/api/shop/';
  shops: IShopInfo[];

  constructor(
    private http: HttpClient,
    private eventBus: EventBusService
  ) { }

  @Cacheable()
  list() {
    return this.http.get<IShopInfo[]>(this.shop_url);
  }

  getShopListFromEvent() {
    this.list().subscribe(shops => {
      this.shops = shops;
      this.eventBus.emit(new EmitEvent(Events.ShopListUpdated, this.shops));
    });
  }

  add(store: ShopCreateRequest) {
    return this.http.post<IShopInfo>(this.shop_url + 'add/', store);
  }

}
