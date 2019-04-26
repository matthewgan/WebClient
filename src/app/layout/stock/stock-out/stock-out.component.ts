import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { StockOutRequest } from 'src/app/shared/interfaces/stock.interface';
import { ShopService } from 'src/app/core/services/shop.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { UserService } from 'src/app/core/services/user.service';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IMerchandiseInfo, MerchandiseQuery } from 'src/app/shared/interfaces/merchandise.interface';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';


@Component({
  selector: 'app-stock-out',
  templateUrl: './stock-out.component.html',
  styleUrls: ['./stock-out.component.scss']
})
export class StockOutComponent implements OnInit {

  form: FormGroup;

  shops: IShopInfo[];
  merchandises: IMerchandiseInfo[];
  merchandiseQuery: MerchandiseQuery;
  user: IUserInfo;

  stockOutRequest: StockOutRequest;

  constructor(
    private formBuilder: FormBuilder,
    private shopService: ShopService,
    private merchandiseService: MerchandiseService,
    private inventoryService: InventoryService,
    private userService: UserService) {
    this.form = this.createFormGroup();
  }

  createFormGroup() {
    return new FormGroup({
      shopID: new FormControl(),
      merchandiseID: new FormControl(),
      number: new FormControl(),
      operator: new FormControl(),
    });
  }

  ngOnInit() {
    this.getShops();
    this.getUser();
  }

  getShops() {
    this.shopService.list().subscribe(shops => {
      this.shops = shops;
    });
  }

  getUser() {
    this.userService.getUserInfo().subscribe(info => {
      this.user = info;
      this.stockOutRequest.operator = this.user.pk;
    });
  }

  searchMerchandise() {
    if (!this.merchandiseQuery.barcode) {
      this.merchandiseService.getInfo(this.merchandiseQuery).subscribe(infos => {
        this.merchandises = infos;
      });
    }
  }

}
