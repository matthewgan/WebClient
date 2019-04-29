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

@NgModule({
  declarations: [
    StockComponent,
    StockInComponent,
    StockOutComponent,
    StockTransferComponent,
    MerchandiseAddComponent,
    StockQueryComponent,
    StockShopComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    PageHeaderModule,
    FormsModule,
    DynamicFormModule
  ]
})
export class StockModule { }
