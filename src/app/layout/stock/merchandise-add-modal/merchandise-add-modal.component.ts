import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchandise-add-modal',
  templateUrl: './merchandise-add-modal.component.html',
  styleUrls: ['./merchandise-add-modal.component.scss']
})
export class MerchandiseAddModalComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onClickCreate() {
    console.log('create');
    this.router.navigate(['/stock/add']);
  }

}
