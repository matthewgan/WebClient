import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { PageHeaderModule } from 'src/app/shared';
import { StoreComponent } from './store.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormModule } from 'src/app/shared/modules/dynamic-form/dynamic-form.module';

@NgModule({
  declarations: [StoreComponent],
  imports: [
    CommonModule,
    StoreRoutingModule,
    PageHeaderModule,
    FormsModule,
    NgbModule,
    DynamicFormModule
  ]
})
export class StoreModule { }
