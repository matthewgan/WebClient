import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import { PageHeaderModule } from 'src/app/shared';
import { StockInComponent } from './stock-in/stock-in.component';
import { StockOutComponent } from './stock-out/stock-out.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { StockQueryComponent } from './stock-query/stock-query.component';
import { FormsModule } from '@angular/forms';
import { MerchandiseAddComponent } from './merchandise-add/merchandise-add.component';
import { DynamicFormModule } from 'src/app/shared/modules/dynamic-form/dynamic-form.module';
import { StockShopComponent } from './stock-shop/stock-shop.component';
import { StockMerchandiseComponent } from './stock-merchandise/stock-merchandise.component';
import { MerchandiseAddModalComponent } from './merchandise-add-modal/merchandise-add-modal.component';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';

@NgModule({
  declarations: [
    StockComponent,
    StockInComponent,
    StockOutComponent,
    StockTransferComponent,
    MerchandiseAddComponent,
    StockQueryComponent,
    StockShopComponent,
    StockMerchandiseComponent,
    MerchandiseAddModalComponent,
  ],
  imports: [
    CommonModule,
    StockRoutingModule,
    PageHeaderModule,
    FormsModule,
    DynamicFormModule,
    NgxSmartModalModule.forRoot()
  ],
  providers: [NgxSmartModalService],
})
export class StockModule { }
