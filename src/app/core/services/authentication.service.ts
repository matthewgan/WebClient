import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
/*     private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>; */

    constructor(private http: HttpClient) {
/*         this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable(); */
    }

/*     public get currentUserValue(): User {
        return this.currentUserSubject.value;
    } */

    login(username: string, password: string) {
         return this.http.post<any>(`${environment.apiUrl}/rest_auth/login/`, { username, password })
            .pipe(map(response => {
                // login successful if there's a jwt token in the response
                if (response) {
                   /*  console.log(response); */
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('CurrentToken', JSON.stringify(response));
                    localStorage.setItem('CurrentUser', username);
                    sessionStorage.setItem('currentToken', JSON.stringify(response));
/*                     console.log(username);
                    console.log(localStorage.getItem('CurrentToken')); */
                }


                return response.data;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('CurrentToken');
        localStorage.removeItem('CurrentUser');
    }
}
