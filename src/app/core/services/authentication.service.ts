import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { IToken } from '../../shared/interfaces/user.interface';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    auth_url = environment.apiUrl + '/rest_auth';
    isAuthenticated = false;

    constructor(private http: HttpClient) {}

    private httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
    };

    login(username: string, password: string): Observable<boolean> {
        return this.http.post<IToken>(this.auth_url + '/login/', {username, password}, this.httpOptions)
            .pipe(
                map((token: IToken) => {
                if (token) {
                    this.saveToken(token);
                    this.isAuthenticated = true;
                    return true;
                }
                catchError(this.handleError);
            }));
    }

    logout() {
        if (this.isAuthenticated) {
            this.clearToken();
        }
        return this.http.post<any>(this.auth_url + '/logout/', this.httpOptions);
    }

    saveToken(token: IToken) {
        localStorage.setItem('token', token.key);
        sessionStorage.setItem('isAuthenticated', 'true');
    }

    getToken(): string {
        return 'Token ' + localStorage.getItem('token');
    }

    clearToken() {
        localStorage.removeItem('token');
        sessionStorage.removeItem('isAuthenticated');
    }

    public getAuthHeader() {
        if (this.isAuthenticated) {
            return this.getToken();
        }
    }

    private handleError(error: HttpErrorResponse) {
        console.error('server error:', error);
        if (error.error instanceof Error) {
          const errMessage = error.error.message;
          return Observable.throw(errMessage);
          // Use the following instead if using lite-server
          // return Observable.throw(err.text() || 'backend server error');
        }
        return Observable.throw(error || 'Server error');
    }
}
