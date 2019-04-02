import { Component, OnInit } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  animations: [routerTransition()]
})
export class InventoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
