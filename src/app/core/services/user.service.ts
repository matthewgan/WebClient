import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { IUserInfo } from '../../shared/interfaces/user.interface';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }

    user_url = environment.apiUrl + '/rest_auth/user/';

    getUserInfo() {
        this.http.get<IUserInfo>(this.user_url).pipe(first()).subscribe(
            userinfo => {
                console.log(userinfo.pk);
            }
        );
    }

    getUserId() {

    }

}
