import { Component, OnInit } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  animations: [routerTransition()]
})
export class StockComponent implements OnInit {
  constructor(
  ) { }

  ngOnInit() {

  }
}
