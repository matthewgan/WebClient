import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class CategoryService {

    category_url = environment.apiUrl + '/api/category/';

    constructor(private http: HttpClient) {}

    list() {
        return this.http.get<ICategory[]>(this.category_url);
    }
}
