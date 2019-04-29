import { Component, OnInit } from '@angular/core';
import { IStockInfo } from 'src/app/shared/interfaces/stock.interface';
import { ActivatedRoute, Params } from '@angular/router';
import { InventoryService } from 'src/app/core/services/inventory.service';

@Component({
  selector: 'app-stock-merchandise',
  templateUrl: './stock-merchandise.component.html',
  styleUrls: ['./stock-merchandise.component.scss']
})
export class StockMerchandiseComponent implements OnInit {

  stockInfos: IStockInfo[];
  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      this.inventoryService.queryStockByMerchandise(id).subscribe((stockInfos: IStockInfo[]) => {
        this.stockInfos = stockInfos.reverse();
      });
    });
  }

}
