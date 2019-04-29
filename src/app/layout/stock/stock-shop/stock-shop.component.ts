import { Component, OnInit } from '@angular/core';
import { IStockInfo } from 'src/app/shared/interfaces/stock.interface';
import { ActivatedRoute, Params } from '@angular/router';
import { InventoryService } from 'src/app/core/services/inventory.service';

@Component({
  selector: 'app-stock-shop',
  templateUrl: './stock-shop.component.html',
  styleUrls: ['./stock-shop.component.scss']
})
export class StockShopComponent implements OnInit {

  stockInfos: IStockInfo[];
  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      this.inventoryService.queryStockByShop(id).subscribe((stockInfos: IStockInfo[]) => {
        this.stockInfos = stockInfos;
      });
    });
  }

}
