import { Component, OnInit } from '@angular/core';
import { IStore } from 'src/app/shared/interfaces';
import { routerTransition } from 'src/app/router.animations';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  animations: [routerTransition()]
})
export class StoresComponent implements OnInit {
  title: string;
  stores: IStore[] = [];
  totalRecords = 10;
  pageSize = 4;

  constructor(private dataservice: DataService) {}

  ngOnInit() {
    this.title = 'Stores';
    this.getShops();
  }

  getShops() {
    this.dataservice.getShops().subscribe(stores => {
      this.stores = stores;
    });
  }

  pageChanged(page: number) {
  }
}
