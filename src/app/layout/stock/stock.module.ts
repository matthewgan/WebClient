import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import { PageHeaderModule } from 'src/app/shared';
import { StockInComponent } from './stock-in/stock-in.component';
import { StockOutComponent } from './stock-out/stock-out.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';

@NgModule({
  declarations: [StockComponent, StockInComponent, StockOutComponent, StockTransferComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    PageHeaderModule
  ]
})
export class StockModule { }
