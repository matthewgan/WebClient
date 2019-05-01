import { Component, OnInit } from '@angular/core';
import { IStockInfo } from 'src/app/shared/interfaces/stock.interface';
import { ActivatedRoute, Params } from '@angular/router';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { ISupplier } from 'src/app/shared/interfaces/supplier.interface';

@Component({
  selector: 'app-stock-shop',
  templateUrl: './stock-shop.component.html',
  styleUrls: ['./stock-shop.component.scss']
})
export class StockShopComponent implements OnInit {

  stockInfos: IStockInfo[];
  shops: IShopInfo[] = JSON.parse(sessionStorage.getItem('shops'));
  suppliers: ISupplier[] = JSON.parse(sessionStorage.getItem('suppliers'));
  displayInfos: any[];
  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      this.inventoryService.queryStockByShop(id).subscribe((stockInfos: IStockInfo[]) => {
        this.stockInfos = stockInfos;
        this.displayInfos = this.setValue();
      });
    });
  }

  setValue() {
    return this.stockInfos.map((info: IStockInfo) => {
      return {
        id: info.id,
        shopName: this.getShopName(info.shopID),
        number: info.number, supplierName:
        this.getSupplierName(info.supplierID),
        created: info.created,
        updated: info.updated
      };
    });
  }

  getShopName(shopID: number) {
    return this.shops.find(x => x.id === shopID).name;
  }

  getSupplierName(supplierID: number) {
    return this.suppliers.find(x => x.id === supplierID).companyName;
  }

}
