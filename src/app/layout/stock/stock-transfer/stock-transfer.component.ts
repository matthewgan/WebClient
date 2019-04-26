import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Validators } from '@angular/forms';

import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';
import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';

import { BarcodeValidator } from 'src/app/shared/validators/barcode_exist.directive';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss']
})
export class StockTransferComponent implements OnInit, AfterViewInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  shops: IShopInfo[] = JSON.parse(sessionStorage.getItem('shops'));
  user: IUserInfo = JSON.parse(sessionStorage.getItem('user'));

  config: FieldConfig[] = [
    {
      type: 'input',
      label: 'Merchandise',
      name: 'merchandiseBarcode',
      placeholder: 'Input barcode of the merchandise',
      validation: [Validators.required, BarcodeValidator],
    },
    {
      type: 'select',
      label: 'from Shop',
      name: 'from_shop',
      options: [],
      placeholder: 'Select a shop',
      validation: [Validators.required],
      value: []
    },
    {
      type: 'select',
      label: 'to Shop',
      name: 'to_shop',
      options: [],
      placeholder: 'Select a shop',
      validation: [Validators.required],
      value: []
    },
    {
      type: 'input',
      label: 'number',
      name: 'number',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: 'operator',
      name: 'operator',
      disabled: true,
      value: this.getCurrentUserName(),
    },
    {
      label: 'Submit',
      name: 'submit',
      type: 'button'
    }
  ];

  shopNameList: string[];
  shopIDList: number[];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.form.config.find(x => x.name === 'from_shop').options = this.getShopNameList();
    this.form.config.find(x => x.name === 'to_shop').options = this.getShopNameList();
    this.cd.detectChanges();
    let previousValid = this.form.valid;
    this.form.changes.subscribe(() => {
      if (this.form.valid !== previousValid) {
        previousValid = this.form.valid;
        this.form.setDisabled('submit', !previousValid);
      }
    });
  }

  getShopIDList() {
    return this.shops.map(t => t.id);
  }

  getShopNameList() {
    return this.shops.map(x => x.name);
  }

  getCurrentUserName() {
    return this.user.username;
  }

  onSubmit(value: {[name: string]: any}) {
    console.log(value);
  }
}
