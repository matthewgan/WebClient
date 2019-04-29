import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class EventBusService {

    subject = new Subject<any>();
    bsubject = new BehaviorSubject<string>('');

    constructor() { }

    on(event: Events, action: any): Subscription {
      return this.subject
            .pipe(
                filter((e: EmitEvent) => {
                  return e.name === event;
                }),
                map((e: EmitEvent) => {
                  return e.value;
                })
              )
                .subscribe(action);
    }

    emit(event: EmitEvent) {
        this.subject.next(event);
    }
}

export class EmitEvent {

  constructor(public name: any, public value?: any) { }

}

export enum Events {
  UserChanged,
  ShopListUpdated,
  SupplierListUpdated,
  ShopSelected,
  SupplierSelected,
  MerchandiseBarcodeFound,
  MerchandiseIdFound,
}
