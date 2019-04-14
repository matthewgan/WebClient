import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { IUserInfo } from '../../shared/interfaces/user.interface';

@Injectable()
export class UserService {

    isSaved = false;
    user: IUserInfo;

    constructor(private http: HttpClient) { }

    user_url = environment.apiUrl + '/rest_auth/user/';

    getUserInfo() {
        this.http.get<IUserInfo>(this.user_url).pipe(first()).subscribe(
            userinfo => {
                this.saveUserInfo(userinfo);
            }
        );
    }

    saveUserInfo(userinfo: IUserInfo) {
        this.user = userinfo;
        this.isSaved = true;
    }

    getUserId(): number {
        if (!this.isSaved) {
            this.getUserInfo();
        }

        return this.user.pk;
    }

    getUserName(): string {
        if (!this.isSaved) {
            this.getUserInfo();
        }

        return this.user.username;
    }
}
