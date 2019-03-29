import { Injectable } from '@angular/core';
import { IStore } from 'src/app/shared/interfaces';

@Injectable()
export class TrackByService {

  store(index: number, store: IStore) {
    return store.name;
  }
}
