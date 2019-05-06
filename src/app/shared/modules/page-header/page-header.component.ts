import { Component, OnInit, Input } from '@angular/core';
import { RouterModule, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
    @Input() heading: string;
    @Input() icon: string;
    displayText: string;
    constructor(
    ) {}

    ngOnInit() {
      switch (this.heading) {
        case 'Stores': {
          this.displayText = '店铺管理';
          break;
        }
        case 'Inventory': {
          this.displayText = '库存管理';
          break;
        }
        case 'Sales': {
          this.displayText = '销量查询';
          break;
        }
        default: {
          break;
        }
      }
    }
}
