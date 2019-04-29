import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './stock.component';
import { StockInComponent } from './stock-in/stock-in.component';
import { StockOutComponent } from './stock-out/stock-out.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { StockQueryComponent } from './stock-query/stock-query.component';
import { MerchandiseAddComponent } from './merchandise-add/merchandise-add.component';
import { StockShopComponent } from './stock-shop/stock-shop.component';
import { StockMerchandiseComponent } from './stock-merchandise/stock-merchandise.component';

const routes: Routes = [
  {
    path: '',
    component: StockComponent,
    children: [
      { path: 'in', component: StockInComponent },
      { path: 'out', component: StockOutComponent },
      { path: 'transfer', component: StockTransferComponent },
      { path: 'add', component: MerchandiseAddComponent },
      { path: 'query', component: StockQueryComponent },
      { path: 'shop/:id', component: StockShopComponent },
      { path: 'merchandise/:id', component: StockMerchandiseComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
