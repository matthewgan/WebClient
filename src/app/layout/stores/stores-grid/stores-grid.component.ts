import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';

@Component({
  selector: 'app-stores-grid',
  templateUrl: './stores-grid.component.html',
  styleUrls: ['./stores-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoresGridComponent implements OnInit {

  @Input() stores: IShopInfo[] = [];

  constructor() { }

  ngOnInit() {
  }

}
