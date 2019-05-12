import { Component, AfterViewInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import { ISalePagination, ISaleInfo } from 'src/app/shared/interfaces/sale.interface';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { SaleService } from 'src/app/core/services/sale.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';
import { PagerService } from 'src/app/core/services/pager.service';

@Component({
  selector: 'app-sales-all',
  templateUrl: './sales-all.component.html',
  styleUrls: ['./sales-all.component.scss']
})
export class SalesAllComponent implements AfterViewInit {

  recordPagination: ISalePagination;
  salesRecords: ISaleInfo[];

  shops: IShopInfo[];
  shopReady = false;

  merchandise: IMerchandiseInfo;

  // pager object
  pager: any = {};
  currentPage = 1;

  subscription: Subscription;
  intervalId: number;

  constructor(
    private saleService: SaleService,
    private shopService: ShopService,
    private merchandiseService: MerchandiseService,
    private eventBus: EventBusService,
    private pagerService: PagerService
  ) { }

  ngAfterViewInit() {

    this.eventBus.on(Events.ShopListUpdated, (shops => {
      this.shops = shops;
      this.shopReady = true;
    }));

    this.eventBus.on(Events.SaleRecordUpdated, (records => {
      this.recordPagination = records;
      this.salesRecords = records.results;
      this.setPage(this.currentPage);
      this.setDisplay();
    }));

    this.eventBus.on(Events.MerchandiseIdFound, (merchandise => {
      this.merchandise = merchandise;
      this.setMerchandiseName();
    }));

    this.shopService.getShopListFromEvent();
    this.saleService.getlistAllSaleRecordsFromEvent();

    // start a timer
    const source = interval(1000);
    this.subscription = source.subscribe(() => {
      // this.setDisplay();
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

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.recordPagination.count, page);

    console.log(page);

    this.saleService.getSaleRecordByPage(page).subscribe((data) => {
      this.recordPagination = data;
      this.salesRecords = this.recordPagination.results;
      this.setDisplay();
    });
  }

  setPreviousPage() {
    const previous = this.recordPagination.previous;
    if (previous !== null) {
      this.pager = this.pagerService.getPager(this.recordPagination.count, this.pager.previous);
      this.saleService.getPrevious(this.recordPagination).subscribe(data => {
        this.recordPagination = data;
        this.salesRecords = this.recordPagination.results;
        this.setDisplay();
      });
      this.currentPage = this.currentPage - 1;
      console.log(this.currentPage);
      this.pager = this.pagerService.getPager(this.recordPagination.count, this.currentPage);
    }
  }

  setNextPage() {
    const next = this.recordPagination.next;
    if ( next !== null ) {
      this.pager = this.pagerService.getPager(this.recordPagination.count, this.pager.next);
      this.saleService.getNext(this.recordPagination).subscribe((data) => {
        this.recordPagination = data;
        this.salesRecords = this.recordPagination.results;
        this.setDisplay();
      });
      // console.log('next');
      this.currentPage = this.currentPage + 1;
      console.log(this.currentPage);
      this.pager = this.pagerService.getPager(this.recordPagination.count, this.currentPage);
    }
  }
}
