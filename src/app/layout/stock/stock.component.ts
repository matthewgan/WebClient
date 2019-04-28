import { Component, OnInit, OnDestroy } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';

import { UserService } from 'src/app/core/services/user.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { SupplierService } from 'src/app/core/services/supplier.service';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  animations: [routerTransition()]
})
export class StockComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private shopService: ShopService,
    private supplierService: SupplierService
  ) { }

  ngOnInit() {
    this.getShopsToStorage();
    this.getUserToStorage();
    this.getSupplierToStorage();
  }

  ngOnDestroy() {
    sessionStorage.removeItem('shops');
    sessionStorage.removeItem('user');
  }

  getShopsToStorage() {
    this.shopService.list().subscribe(shops => {
      sessionStorage.setItem('shops', JSON.stringify(shops));
    });
  }

  getUserToStorage() {
    this.userService.getUserInfo().subscribe(user => {
      sessionStorage.setItem('user', JSON.stringify(user));
    });
  }

  getSupplierToStorage() {
    this.supplierService.list().subscribe(suppliers => {
      sessionStorage.setItem('suppliers', JSON.stringify(suppliers));
    });
  }
}
