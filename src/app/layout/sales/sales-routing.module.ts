import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesComponent } from './sales.component';
import { SalesAllComponent } from './sales-all/sales-all.component';
import { SalesShopComponent } from './sales-shop/sales-shop.component';

const routes: Routes = [
  { path: '',
  component: SalesComponent,
  children: [
    { path: '', redirectTo: 'all' },
    { path: 'all', component: SalesAllComponent },
    { path: 'shop/:id', component: SalesShopComponent },
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
