import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoresRoutingModule } from './stores-routing.module';
import { StoresComponent } from './stores.component';
import { PageHeaderModule, PaginationModule } from 'src/app/shared';
import { StoresGridComponent } from './stores-grid/stores-grid.component';

@NgModule({
  declarations: [StoresComponent, StoresGridComponent],
  imports: [
    CommonModule,
    StoresRoutingModule,
    PageHeaderModule,
    PaginationModule,
  ]
})
export class StoresModule { }
