import { Component, OnInit } from '@angular/core';
import { IStore } from 'src/app/shared/interfaces';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  animations: [routerTransition()]
})
export class StoresComponent implements OnInit {

  title: string;
  stores: IStore[] = [];
  filteredStores: IStore[] = [];
  totalRecords = 0;
  pageSize = 10;

  constructor() { }

  ngOnInit() {
    this.title = 'Stores';
  }

}
