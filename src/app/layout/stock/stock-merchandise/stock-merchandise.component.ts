import { Component, OnInit } from '@angular/core';
import { IStockInfo } from 'src/app/shared/interfaces/stock.interface';
import { ActivatedRoute, Params } from '@angular/router';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { ISupplier } from 'src/app/shared/interfaces/supplier.interface';

@Component({
  selector: 'app-stock-merchandise',
  templateUrl: './stock-merchandise.component.html',
  styleUrls: ['./stock-merchandise.component.scss']
})
export class StockMerchandiseComponent implements OnInit {

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
      this.inventoryService.queryStockByMerchandise(id).subscribe((stockInfos: IStockInfo[]) => {
        this.stockInfos = stockInfos.reverse();
        this.displayInfos = this.setValue();
      });
    });
    this.setValue();
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
