import { Component, OnInit } from '@angular/core';
import { SaleService } from 'src/app/core/services/sale.service';
import { ISaleInfo, ISalePagination } from 'src/app/shared/interfaces/sale.interface';
import { ShopService } from 'src/app/core/services/shop.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  animations: [routerTransition()]
})
export class SalesComponent implements OnInit {

  sales: ISaleInfo[];
  displaySales: any[];
  shops: IShopInfo[];
  merchandises: IMerchandiseInfo[];

  constructor(
    private saleService: SaleService,
    private shopService: ShopService,
    private merchandiseService: MerchandiseService
  ) { }

  ngOnInit() {
    this.getSales();
    this.displaySales = this.setValue();
  }
  getSales() {
    this.saleService.listAllSaleRecords()
      .subscribe((res: ISalePagination) => {
        if (res) {
          this.sales = res.results;
        } else {
          console.log('unable to get sale records');
        }
      });
  }

  setValue(): any[] {
    return this.sales.map((sale: ISaleInfo) => {
      return {id: sale.id, number: sale.number, created: sale.created, updated: sale.updated, shopName: this.getShopName(sale.shop)};
    });
  }

  getShopName(shopID: number) {
    this.shopService.list().subscribe(shops => {
      this.shops = shops;
    });
    return this.shops.find(x => x.id === shopID).name;
  }

  /* getMerchandiseName(merchandiseID: number) {
    this.merchandiseService.getInfo().subscribe(merchandises => {
      this.merchandises = merchandises;
    });
    return this.merchandises.find(x => x.id === merchandiseID).name;
  } */

}
