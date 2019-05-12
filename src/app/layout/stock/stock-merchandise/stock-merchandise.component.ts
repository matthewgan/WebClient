import { Component, AfterViewInit } from '@angular/core';
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
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';

@Component({
  selector: 'app-stock-merchandise',
  templateUrl: './stock-merchandise.component.html',
  styleUrls: ['./stock-merchandise.component.scss']
})
export class StockMerchandiseComponent implements AfterViewInit {

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
    private eventBus: EventBusService,
    private growler: GrowlerService,
  ) { }

  ngAfterViewInit() {
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

    // this.eventBus.on(Events.MerchandiseStockFound, (infos => {
    //   this.stockInfos = infos;
    //   this.setDisplay();
    // }));

    this.shopService.getShopListFromEvent();
    this.supplierService.getSupplierListFromEvent();

    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      // this.inventoryService.queryStockByMerchandiseFromEvent(id);
      this.inventoryService.queryStockByMerchandise(id).subscribe(data => {
        this.stockInfos = data;
        if (this.stockInfos.length === 0) {
          this.growler.growl('没有找到该商品的库存记录', GrowlerMessageType.Danger);
        }
        this.setDisplay();
      });
    });
  }

  setDisplay() {
    this.stockInfos.forEach(info => {
      // this.merchandiseService.getInfoByIdFromEvent(info.merchandiseID.toString());
      this.merchandiseService.getInfoById(info.merchandiseID.toString()).subscribe((merchandise: IMerchandiseInfo) => {
        this.merchandise = merchandise;
        this.getMerchandiseName();
        info.shopName = this.shops.find(s => s.id === info.shopID).name;
        info.supplierName = this.suppliers.find(sp => sp.id === info.supplierID).companyName;
      });
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
