import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'stores', loadChildren: './stores/stores.module#StoresModule' },
            { path: 'add', loadChildren: './store/store.module#StoreModule' },
            { path: 'inventory', loadChildren: './inventory/inventory.module#InventoryModule' },
            { path: 'stock', loadChildren: './stock/stock.module#StockModule' },
            { path: 'sales', loadChildren: './sales/sales.module#SalesModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
