import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { MerchandiseQuery, IMerchandiseInfo, MerchandiseCreateRequest } from 'src/app/shared/interfaces/merchandise.interface';
import { environment } from 'src/environments/environment';
import { EventBusService, Events, EmitEvent } from './event-bus.service';

@Injectable()
export class MerchandiseService {

    merchandise_url = environment.apiUrl + '/api/merchandise/';
    merchandises: IMerchandiseInfo[];
    merchandise: IMerchandiseInfo;

    constructor(
        private http: HttpClient,
        private eventBus: EventBusService
    ) {}

    getInfoByBarcode(barcode: string) {
        const query = new MerchandiseQuery();
        query.barcode = barcode;
        return this.http.post(this.merchandise_url + 'fast_query/', query, {observe: 'response'});
    }

    add(merchandise: MerchandiseCreateRequest) {
        return this.http.post(this.merchandise_url + 'add/', merchandise);
    }

    getInfoById(id: string) {
        const retrieveUrl = this.merchandise_url + id + '/';
        return this.http.get<IMerchandiseInfo>(retrieveUrl);
    }

    getInfoByBarcodeFromEvent(barcode: string) {
        this.getInfoByBarcode(barcode).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.merchandises = <IMerchandiseInfo[]>response.body;
                    this.eventBus.emit(new EmitEvent(Events.MerchandiseBarcodeFound, this.merchandises));
                } else if (response.status === 204) {
                    this.eventBus.emit(new EmitEvent(Events.MerchandiseBarcodeFound, 'NotFound'));
                }
            },
        );
    }

    getInfoByIdFromEvent(id: string) {
        this.getInfoById(id).subscribe(merchandise => {
            this.merchandise = merchandise;
            this.eventBus.emit(new EmitEvent(Events.MerchandiseIdFound, this.merchandise));
        });
    }

    getIdByName(name: string, plural: IMerchandiseInfo[]) {
        const index = plural.findIndex(x => x.name === name);
        if (index > -1) {
            return plural[index].id;
        }
    }
}
