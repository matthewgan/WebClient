import { Component, OnInit } from '@angular/core';
import { IStockInfo } from 'src/app/shared/interfaces/stock.interface';
import { ActivatedRoute, Params } from '@angular/router';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { ISupplier } from 'src/app/shared/interfaces/supplier.interface';
import { ShopService } from 'src/app/core/services/shop.service';
import { SupplierService } from 'src/app/core/services/supplier.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';
import { IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';

@Component({
  selector: 'app-stock-merchandise',
  templateUrl: './stock-merchandise.component.html',
  styleUrls: ['./stock-merchandise.component.scss']
})
export class StockMerchandiseComponent implements OnInit {

  stockInfos: IStockInfo[];
  shops: IShopInfo[];
  suppliers: ISupplier[];
  displayInfos: any[];
  merchandise: IMerchandiseInfo;
  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private shopService: ShopService,
    private supplierService: SupplierService,
    private merchandiseService: MerchandiseService,
    private eventBus: EventBusService
  ) { }

  ngOnInit() {
    this.eventBus.on(Events.ShopListUpdated, (shops => {
      this.shops = shops;
    }));

    this.eventBus.on(Events.SupplierListUpdated, (suppliers => {
      this.suppliers = suppliers;
    }));

    this.eventBus.on(Events.MerchandiseIdFound, (merchandise => {
      this.merchandise = merchandise;
      this.getMerchandiseName();
    }));

    this.eventBus.on(Events.MerchandiseStockFound, (infos => {
      this.stockInfos = infos;
      this.setDisplay();
    }));

    this.shopService.getShopListFromEvent();
    this.supplierService.getSupplierListFromEvent();

    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      this.inventoryService.queryStockByMerchandiseFromEvent(id);
    });
  }

  setDisplay() {
    this.displayInfos = this.stockInfos.reverse().map(info => {
      this.merchandiseService.getInfoByIdFromEvent(info.merchandiseID.toString());
      return {
        id: info.id,
        shopName: this.getShopName(info.shopID),
        number: info.number,
        supplierName: this.getSupplierName(info.supplierID),
        created: info.created,
        updated: info.updated,
        merchandiseName: 'test'
      };
    });
  }

  getShopName(shopID: number) {
    return this.shops.find(x => x.id === shopID).name;
  }

  getSupplierName(supplierID: number) {
    return this.suppliers.find(x => x.id === supplierID).companyName;
  }

  getMerchandiseName() {
    this.displayInfos.forEach( res => {
      res.merchandiseName = this.merchandise.name;
    });
  }

}
