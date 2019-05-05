import { Component, OnInit } from '@angular/core';
import { SaleService } from 'src/app/core/services/sale.service';
import { ISaleInfo, ISalePagination } from 'src/app/shared/interfaces/sale.interface';
import { ShopService } from 'src/app/core/services/shop.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { routerTransition } from 'src/app/router.animations';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  animations: [routerTransition()]
})
export class SalesComponent implements OnInit {

  constructor() { }

  ngOnInit() { }


}
