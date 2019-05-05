import { Component, OnInit } from '@angular/core';
import { SaleService } from 'src/app/core/services/sale.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { ISaleInfo } from 'src/app/shared/interfaces/sale.interface';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-sales-shop',
  templateUrl: './sales-shop.component.html',
  styleUrls: ['./sales-shop.component.scss']
})
export class SalesShopComponent implements OnInit {

  displaySales: any[];
  shops: IShopInfo[];
  shopSaleRecords: ISaleInfo[];
  merchandise: IMerchandiseInfo;

  constructor(
    private saleService: SaleService,
    private shopService: ShopService,
    private merchandiseService: MerchandiseService,
    private eventBus: EventBusService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.eventBus.on(Events.ShopListUpdated, (shops => {
      this.shops = shops;
    }));

    this.eventBus.on(Events.ShopSaleRecordUpdated,(shopRecords => {
      this.shopSaleRecords = shopRecords;
      this.setDisplay();
    }));

    this.eventBus.on(Events.MerchandiseIdFound, (merchandise => {
      this.merchandise = merchandise;
      this.setMerchandiseName();
    }));

    this.shopService.getShopListFromEvent();

    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      this.saleService.getSaleRecordByShopFromEvent(id);
    });
  }

  setDisplay() {
    this.displaySales = this.shopSaleRecords.map(record => {
      this.merchandiseService.getInfoByIdFromEvent(record.merchandise.toString());
      return {
        id: record.id,
        number: record.number,
        created: record.created,
        updated: record.updated,
        shopName: this.shops.find(x => x.id === record.shop).name,
        merchandiseId: record.merchandise,
        merchandiseName: 'test'
      };
    });
  }
  setMerchandiseName() {
    this.displaySales.forEach( res => {
      if (res.merchandiseId === this.merchandise.id) {
        res.merchandiseName = this.merchandise.name;
      }
    });
  }

}
