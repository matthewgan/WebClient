import { Component, OnInit } from '@angular/core';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IStockOutRequest } from 'src/app/shared/interfaces/stock.interface';
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
  stockOut: IStockOutRequest = {
    shopID: 0,
    merchandiseID: 0,
    number: 0,
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
  searchedBarcode: boolean;

  constructor(
    private shopService: ShopService,
    private merchandiseService: MerchandiseService,
    private growler: GrowlerService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }


  queryId(event: Event) {
    event.preventDefault();
    this.merchandiseService.getInfo(this.merchandiseQuery)
      .subscribe((merchandise: IMerchandiseInfo) => {
        if (merchandise) {
          this.growler.growl('查询成功！', GrowlerMessageType.Success);
          this.merchandise = merchandise;
          this.stockOut.merchandiseID = merchandise.id;
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
