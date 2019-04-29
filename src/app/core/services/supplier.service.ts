import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ISupplier, ISupplierPagination } from 'src/app/shared/interfaces/supplier.interface';
import { environment } from 'src/environments/environment';
import { Cacheable } from 'ngx-cacheable';
import { EventBusService, EmitEvent, Events } from './event-bus.service';

@Injectable()
export class SupplierService {

    supplier_url = environment.apiUrl + '/api/supplier/';
    suppliers: ISupplier[];

    constructor(
        private http: HttpClient,
        private eventBus: EventBusService
    ) {}

    @Cacheable()
    list() {
        return this.http.get<ISupplier[]>(this.supplier_url);
    }

    getSupplierListFromEvent() {
        this.list().subscribe(suppliers => {
            this.suppliers = suppliers;
            this.eventBus.emit(new EmitEvent(Events.SupplierListUpdated, this.suppliers));
        });
    }
}
