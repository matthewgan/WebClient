import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './stock.component';
import { StockInComponent } from './stock-in/stock-in.component';
import { StockOutComponent } from './stock-out/stock-out.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';

const routes: Routes = [
  {
    path: '',
    component: StockComponent,
    children: [
      { path: 'in', component: StockInComponent },
      { path: 'out', component: StockOutComponent },
      { path: 'transfer', component: StockTransferComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
