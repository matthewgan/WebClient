import { Component, OnInit } from '@angular/core';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { StockOutRequest } from 'src/app/shared/interfaces/stock.interface';
import { MerchandiseQuery, IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';
import { ShopService } from 'src/app/core/services/shop.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-out',
  templateUrl: './stock-out.component.html',
  styleUrls: ['./stock-out.component.scss']
})
export class StockOutComponent implements OnInit {

  shops: IShopInfo[] = [];
  stockOut: StockOutRequest = {
    shopID: 0,
    merchandiseID: 0,
    number: 0,
    operator: 0
  };
  merchandiseQuery: MerchandiseQuery = {
    barcode: ''
  };
  merchandises: IMerchandiseInfo[];
  user: IUserInfo = {
    pk: -1,
    username: ''
  };
  searchedBarcode: boolean;

  constructor(
    private shopService: ShopService,
    private merchandiseService: MerchandiseService,
    private growler: GrowlerService,
    private userService: UserService,
    private router: Router
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

  getUser() {
    this.userService.getUserInfo().subscribe(info => {
      this.user = info;
      this.stockOut.operator = this.user.pk;
    });
  }

  searchMerchandise() {
    if (!this.merchandiseQuery.barcode) {
      this.merchandiseService.getInfo(this.merchandiseQuery).subscribe(infos => {
        this.merchandises = infos;
      });
    }
  }


  queryId(event: Event) {
    event.preventDefault();
    this.merchandiseService.getInfo(this.merchandiseQuery)
      .subscribe((merchandises: IMerchandiseInfo[]) => {
        if (merchandises) {
          this.growler.growl('查询成功！', GrowlerMessageType.Success);
          this.merchandises = merchandises;
          this.stockOut.merchandiseID = merchandises[0].id;
          this.searchedBarcode = true;
        } else {
          this.growler.growl('商品不存在！', GrowlerMessageType.Danger);
          this.stockOut.merchandiseID = 0;
        }
      },
      (err: any) => {
        this.growler.growl('Barcode格式错误！', GrowlerMessageType.Danger);
      });
  }

  submit() {}

}
