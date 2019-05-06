import { Component, OnInit } from '@angular/core';
import { ISalePagination, ISaleInfo } from 'src/app/shared/interfaces/sale.interface';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { SaleService } from 'src/app/core/services/sale.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';

@Component({
  selector: 'app-sales-all',
  templateUrl: './sales-all.component.html',
  styleUrls: ['./sales-all.component.scss']
})
export class SalesAllComponent implements OnInit {

  salesRecords: ISaleInfo[];
  shops: IShopInfo[];
  merchandise: IMerchandiseInfo;

  constructor(
    private saleService: SaleService,
    private shopService: ShopService,
    private merchandiseService: MerchandiseService,
    private eventBus: EventBusService
  ) { }

  ngOnInit() {

    this.eventBus.on(Events.ShopListUpdated, (shops => {
      this.shops = shops;
    }));
    this.eventBus.on(Events.SaleRecordUpdated, (records => {
      this.salesRecords = records.results;
      this.setDisplay();
    }));
    this.eventBus.on(Events.MerchandiseIdFound, (merchandise => {
      this.merchandise = merchandise;
      this.setMerchandiseName();
    }));

    this.shopService.getShopListFromEvent();
    this.saleService.getlistAllSaleRecordsFromEvent();
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
