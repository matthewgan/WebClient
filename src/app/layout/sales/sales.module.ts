import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { PageHeaderModule, StatModule } from 'src/app/shared';

@NgModule({
  declarations: [SalesComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    PageHeaderModule,
    StatModule
  ]
})
export class SalesModule { }
