import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesComponent } from './sales.component';
import { SalesAllComponent } from './sales-all/sales-all.component';
import { SalesShopComponent } from './sales-shop/sales-shop.component';
import { SalesMerchandiseComponent } from '../sales/sales-merchandise/sales-merchandise.component';
import { SalesQueryComponent } from './sales-query/sales-query.component';

const routes: Routes = [
  { path: '',
  component: SalesComponent,
  children: [
    { path: '', redirectTo: 'all' },
    { path: 'all', component: SalesAllComponent },
    { path: 'shop/:id', component: SalesShopComponent },
    { path: 'merchandise/:id', component: SalesMerchandiseComponent},
    { path: 'query', component: SalesQueryComponent},
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
