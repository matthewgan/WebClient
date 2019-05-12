import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SaleService } from 'src/app/core/services/sale.service';

import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';
import { ISalePagination, ISaleInfo } from 'src/app/shared/interfaces/sale.interface';
import { PagerService } from 'src/app/core/services/pager.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';

@Component({
  selector: 'app-sales-merchandise',
  templateUrl: './sales-merchandise.component.html',
  styleUrls: ['./sales-merchandise.component.scss']
})
export class SalesMerchandiseComponent implements AfterViewInit {

  shops: IShopInfo[];
  merchandise: IMerchandiseInfo;

  // recordPagination: ISalePagination;
  salesRecords: ISaleInfo[];

  // pager object
  pager: any = {};
  currentPage = 1;

  constructor(
    private router: ActivatedRoute,
    private saleService: SaleService,
    private merchandiseService: MerchandiseService,
    private eventBus: EventBusService,
    private shopService: ShopService,
    private growler: GrowlerService,
  ) { }

  ngAfterViewInit() {
    this.eventBus.on(Events.ShopListUpdated, (shops => {
      this.shops = shops;
    }));

    // this.eventBus.on(Events.SaleRecordUpdated, (records => {
    //   // this.recordPagination = records;
    //   this.salesRecords = records.results;
    //   this.setPage(this.currentPage);
    //   this.setDisplay();
    // }));

    this.eventBus.on(Events.MerchandiseIdFound, (merchandise => {
      this.merchandise = merchandise;
      this.setMerchandiseName();
    }));

    this.shopService.getShopListFromEvent();

    this.router.params.subscribe((params: Params) => {
      const id = +params['id'];
      this.saleService.getSaleRecordByMerchandise(id).subscribe(data => {
        this.salesRecords = data;
        if (this.salesRecords.length === 0) {
          this.growler.growl('没有找到该商品的销售记录', GrowlerMessageType.Danger);
        }
        this.setDisplay();
      });
    });
  }

  setDisplay() {
    this.salesRecords.forEach(record => {
      this.merchandiseService.getInfoByIdFromEvent(record.merchandise.toString());
      record.shopName = this.shops.find(x => x.id === record.shop).name;
    });
  }

  setMerchandiseName() {
    this.salesRecords.forEach(record => {
      if (record.merchandise === this.merchandise.id) {
        record.merchandiseName = this.merchandise.name;
      }
    });
  }
}
