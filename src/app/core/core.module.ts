import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { GrowlerModule } from './growler/growler.module';

import { EventBusService } from './services/event-bus.service';
import { HttpConfigInterceptor } from './interceptors/httpconfig.interceptor';
import { ShopService } from './services/shop.service';
import { UserService } from './services/user.service';
import { SaleService } from './services/sale.service';
import { CategoryService } from './services/category.service';
import { SupplierService } from './services/supplier.service';
import { MerchandiseService } from './services/merchandise.service';
import { InventoryService } from './services/inventory.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        GrowlerModule,
     ],
    exports: [
        GrowlerModule,
    ],
    providers: [
        ShopService,
        UserService,
        SaleService,
        CategoryService,
        SupplierService,
        MerchandiseService,
        InventoryService,
        EventBusService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpConfigInterceptor,
            multi: true,
        }
    ],
})

// Ensure that CoreModule is only loaded into AppModule
export class CoreModule extends EnsureModuleLoadedOnceGuard {
    // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        super(parentModule);
    }
}

