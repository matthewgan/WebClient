import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { PageHeaderModule, StatModule } from 'src/app/shared';
import { SalesShopComponent } from './sales-shop/sales-shop.component';
import { SalesAllComponent } from './sales-all/sales-all.component';
import { SalesMerchandiseComponent } from './sales-merchandise/sales-merchandise.component';
import { SalesQueryComponent } from './sales-query/sales-query.component';
import { DynamicFormModule } from 'src/app/shared/modules/dynamic-form/dynamic-form.module';

@NgModule({
  declarations: [SalesComponent, SalesShopComponent, SalesAllComponent, SalesMerchandiseComponent, SalesQueryComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    PageHeaderModule,
    StatModule,
    DynamicFormModule,
  ]
})
export class SalesModule { }
