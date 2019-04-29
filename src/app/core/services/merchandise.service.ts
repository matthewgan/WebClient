import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MerchandiseQuery, IMerchandiseInfo, MerchandiseCreateRequest } from 'src/app/shared/interfaces/merchandise.interface';
import { environment } from 'src/environments/environment';
import { Cacheable } from 'ngx-cacheable';

@Injectable()
export class MerchandiseService {

    merchandise_url = environment.apiUrl + '/api/merchandise/';

    constructor(private http: HttpClient) {}

    @Cacheable()
    getInfo(info: MerchandiseQuery) {
        return this.http.post<IMerchandiseInfo[]>(this.merchandise_url + 'fast_query/', info);
    }

    add(merchandise: MerchandiseCreateRequest) {
        return this.http.post(this.merchandise_url + 'add/', merchandise);
    }
}
