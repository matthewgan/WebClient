import { Component, OnInit, Input } from '@angular/core';
import { RouterModule, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
    @Input() heading: string;
    @Input() icon: string;

    operationText: string;
    constructor(
      private route: ActivatedRoute
    ) {}

    ngOnInit() {
      /* this.route.parent.params.subscribe((params: Params) => {
        const id = +params['in'];
        if (id !== 0) {
          this.operationText = '';
        }
      }); */
    }
}
