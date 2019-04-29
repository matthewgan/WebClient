import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { IShopInfo, IShopCreateRequest } from 'src/app/shared/interfaces/shop.interface';
import { NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShopService } from 'src/app/core/services/shop.service';
import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';
import { ISupplier } from 'src/app/shared/interfaces/supplier.interface';
import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';
import { BarcodeValidator } from 'src/app/shared/validators/barcode_exist.directive';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
  animations: [routerTransition()]
})
/* export class StoreComponent implements OnInit {

  store: IShopCreateRequest = {
    name: '',
    city: '',
    capacity: 0
  };

  errorMessage: string;
  operationText = 'Submit';
  @ViewChild('storeForm') storeForm: NgForm;

  constructor(
    private router: Router,
    private dataService: ShopService
  ) { }

  ngOnInit() {
  }

  submit() {
    this.dataService.add(this.store)
      .subscribe((createdStore: IShopInfo) => {
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

} */

export class StoreComponent implements OnInit, AfterViewInit {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  config: FieldConfig[] = [
    {
      type: 'input',
      label: 'Shop Name',
      name: 'name',
      placeholder: 'Input a shop name',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: 'City',
      name: 'city',
      placeholder: 'Input a city',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: 'Capacity',
      name: 'capacity',
      placeholder: 'Input a capacity',
      validation: [Validators.required],
    },
    {
      label: 'Submit',
      name: 'submit',
      type: 'button',
    }
  ];

  shop: IShopCreateRequest;

  constructor(
    private cd: ChangeDetectorRef,
    private shopService: ShopService,
    private growlService: GrowlerService,
    private router: Router
    ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.cd.detectChanges();
    let previousValid = this.form.valid;
    this.form.changes.subscribe(() => {
      if (this.form.valid !== previousValid) {
        previousValid = this.form.valid;
        this.form.setDisabled('submit', !previousValid);
      }
    });
  }

  onSubmit() {
    console.log(this.form.value);
    this.shop = this.form.value;
    console.log(this.shop);
    this.shopService.add(this.shop)
      .subscribe((createdShop: IShopInfo) => {
        if (createdShop) {
          this.growlService.growl('添加成功', GrowlerMessageType.Success);
          this.router.navigate(['/stores']);
        } else {
          this.growlService.growl('添加失败', GrowlerMessageType.Danger);
        }
      });
  }
}
