import { Component, OnInit } from '@angular/core';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { routerTransition } from 'src/app/router.animations';
import { ShopService } from 'src/app/core/services/shop.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  animations: [routerTransition()]
})
export class StoresComponent implements OnInit {
  title: string;
  stores: IShopInfo[] = [];
  totalRecords = 10;
  pageSize = 4;

  constructor(
    private shopService: ShopService,
  ) {}

  ngOnInit() {
    this.title = 'Stores';
    this.getShops();
  }

  getShops() {
    this.shopService.list().subscribe(stores => {
      this.stores = stores;
    });
  }

  pageChanged(page: number) {
  }
}
