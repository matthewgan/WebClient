import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { IUserInfo } from '../../shared/interfaces/user.interface';
import { Cacheable } from 'ngx-cacheable';
import { EventBusService, Events, EmitEvent } from './event-bus.service';

@Injectable()
export class UserService {

    constructor(
      private http: HttpClient,
      private eventBus: EventBusService,
    ) { }

    user_url = environment.apiUrl + '/rest_auth/user/';
    user: IUserInfo;

    @Cacheable()
    getUserInfo() {
      return this.http.get<IUserInfo>(this.user_url);
    }

    getUserFromEvent() {
      this.getUserInfo().subscribe((user: IUserInfo) => {
        this.user = user;
        this.eventBus.emit(new EmitEvent(Events.UserChanged, this.user));
      });
    }
}
