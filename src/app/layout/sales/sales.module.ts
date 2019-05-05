import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { PageHeaderModule, StatModule } from 'src/app/shared';
import { SalesShopComponent } from './sales-shop/sales-shop.component';
import { SalesAllComponent } from './sales-all/sales-all.component';

@NgModule({
  declarations: [SalesComponent, SalesShopComponent, SalesAllComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    PageHeaderModule,
    StatModule
  ]
})
export class SalesModule { }
