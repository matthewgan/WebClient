import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IStore } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': 'Token ' + JSON.parse(localStorage.getItem('CurrentToken')).key
    })
  };

  getShops() {
      /* console.log(this.httpOptions.headers.get('Authorization')); */
      return this.http.get<IStore[]>(`${environment.apiUrl}/api/shop`, this.httpOptions)
            .pipe(
              map(res => {
                this.formateDate(res);
                return res;
              })
            );
  }

  formateDate(stores: IStore[]) {
    for (const store of stores) {
      store.openingTime = new Date(store.openingTime).toLocaleDateString();
    }
  }

}
