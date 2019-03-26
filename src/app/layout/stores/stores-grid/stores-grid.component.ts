import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { IStore } from 'src/app/shared/interfaces';
import { TrackByService } from 'src/app/core/services/trackby.service';

@Component({
  selector: 'app-stores-grid',
  templateUrl: './stores-grid.component.html',
  styleUrls: ['./stores-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoresGridComponent implements OnInit {

  @Input() stores: IStore[] = [];

  constructor() { }

  ngOnInit() {
  }

}
