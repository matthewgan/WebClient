import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ISupplier, ISupplierPagination } from 'src/app/shared/interfaces/supplier.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class SupplierService {

    supplier_url = environment.apiUrl + '/api/supplier/';

    constructor(private http: HttpClient) {}

    list() {
        return this.http.get<ISupplierPagination>(this.supplier_url);
    }
}
