import { Component, OnInit } from '@angular/core';
import { IStockInfo } from 'src/app/shared/interfaces/stock.interface';
import { ActivatedRoute, Params } from '@angular/router';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { ISupplier } from 'src/app/shared/interfaces/supplier.interface';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';
import { SupplierService } from 'src/app/core/services/supplier.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';

@Component({
  selector: 'app-stock-shop',
  templateUrl: './stock-shop.component.html',
  styleUrls: ['./stock-shop.component.scss']
})
export class StockShopComponent implements OnInit {

  stockInfos: IStockInfo[];
  shops: IShopInfo[];
  suppliers: ISupplier[];
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

    this.eventBus.on(Events.ShopStockFound, (infos => {
      this.stockInfos = infos;
      this.setDisplay();
    }));

    this.shopService.getShopListFromEvent();
    this.supplierService.getSupplierListFromEvent();

    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      this.inventoryService.queryStockByShopfromEvent(id);
    });
  }

  setDisplay() {
    this.stockInfos.forEach(info => {
      this.merchandiseService.getInfoByIdFromEvent(info.merchandiseID.toString());
      info.shopName = this.shops.find(s => s.id === info.shopID).name;
      info.supplierName = this.suppliers.find(sp => sp.id === info.supplierID).companyName;
    });
  }

  getMerchandiseName() {
    this.stockInfos.forEach(res => {
      if (res.merchandiseID === this.merchandise.id) {
        res.merchandiseName = this.merchandise.name;
      }
    });
  }

}
