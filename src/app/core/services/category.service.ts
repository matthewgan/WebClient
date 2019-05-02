import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Cacheable } from 'ngx-cacheable';

import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { environment } from 'src/environments/environment';
import { EventBusService, Events, EmitEvent } from './event-bus.service';

@Injectable()
export class CategoryService {

    category_url = environment.apiUrl + '/api/category/';

    categories: ICategory[];

    constructor(
        private http: HttpClient,
        private eventBus: EventBusService
    ) {}

    @Cacheable()
    list() {
        return this.http.get<ICategory[]>(this.category_url);
    }

    getCategoryListFromEvent() {
        this.list().subscribe(cats => {
            this.categories = cats;
            this.eventBus.emit(new EmitEvent(Events.CategoryListUpdated, this.categories));
          });
    }
}
