import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IStockInRequest } from 'src/app/shared/interfaces/stock.interface';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { ShopService } from 'src/app/core/services/shop.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { MerchandiseQuery, IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';
import { UserService } from 'src/app/core/services/user.service';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-stock-in',
  templateUrl: './stock-in.component.html',
  styleUrls: ['./stock-in.component.scss']
})
export class StockInComponent implements OnInit {

  shops: IShopInfo[] = [];
  stockIn: IStockInRequest = {
    shopID: 0,
    merchandiseID: 0,
    number: 0,
    supplierID: 0,
    operator: 0
  };
  merchandiseQuery: MerchandiseQuery = {
    barcode: ''
  };
  merchandise: IMerchandiseInfo;
  user: IUserInfo = {
    pk: -1,
    username: ''
  };
  createNewMerchandiseEnabled: boolean;
  @ViewChild('storeForm') storeForm: NgForm;

  constructor(
    private shopService: ShopService,
    private merchandiseService: MerchandiseService,
    private growler: GrowlerService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getShops();
    this.getUser();
  }

  getShops() {
    this.shopService.list().subscribe(shops => {
      this.shops = shops;
    });
  }

  getChange(id: number) {
    console.log('=========');
    console.log(id);
  }

  queryid(merchandiseQuery: MerchandiseQuery) {
    this.merchandiseService.getInfo(merchandiseQuery)
      .subscribe((merchandise: IMerchandiseInfo) => {
          this.merchandise = merchandise;
          this.stockIn.merchandiseID = merchandise.id;
      },
      (err: any) => {
        this.growler.growl('商品不存在！', GrowlerMessageType.Danger);
        this.createNewMerchandiseEnabled = true;
      });
  }

  getUser() {
    this.userService.getUserInfo()
      .subscribe(user => {
        this.user = user;
        this.stockIn.operator = this.user.pk;
      });
  }

  submit() {}
}
