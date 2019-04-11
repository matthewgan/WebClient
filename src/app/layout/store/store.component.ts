import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { IStore } from 'src/app/shared/interfaces';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
  animations: [routerTransition()]
})
export class StoreComponent implements OnInit {

  store: IStore = {
    name: '',
    city: ''
  };

  errorMessage: string;
  operationText = 'Submit';
  @ViewChild('storeForm') storeForm: NgForm;

  constructor(
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {
  }

  submit() {
    this.dataService.addShop(this.store)
      .subscribe((createdStore: IStore) => {
        if (createdStore) {
          this.storeForm.form.markAsPristine();
          this.router.navigate(['/stores']);
        } else {
          const msg = 'Unable to add store';
          this.errorMessage = msg;
        }
      });
  }

  cancel(event: Event) {
    event.preventDefault();
    // Route guard will take care of showing modal dialog service if data is dirty
    this.router.navigate(['/stores']);
  }

}
