import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { StockOutRequest } from 'src/app/shared/interfaces/stock.interface';
import { MerchandiseQuery, IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { ISupplier } from 'src/app/shared/interfaces/supplier.interface';
import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';
import { Validators } from '@angular/forms';
import { BarcodeValidator } from 'src/app/shared/validators/barcode_exist.directive';

@Component({
  selector: 'app-stock-out',
  templateUrl: './stock-out.component.html',
  styleUrls: ['./stock-out.component.scss']
})
export class StockOutComponent implements OnInit, AfterViewInit {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  shops: IShopInfo[] = JSON.parse(sessionStorage.getItem('shops'));
  user: IUserInfo = JSON.parse(sessionStorage.getItem('user'));
  suppliers: ISupplier[] = JSON.parse(sessionStorage.getItem('suppliers'));

  config: FieldConfig[] = [
    {
      type: 'select',
      label: 'Shop',
      name: 'shopName',
      options: [],
      placeholder: 'Select a shop',
      validation: [Validators.required],
      value: []
    },
    {
      type: 'input',
      label: 'Merchandise',
      name: 'merchandiseBarcode',
      placeholder: 'Input barcode of the merchandise',
      validation: [Validators.required, BarcodeValidator],
    },
    {
      type: 'select',
      label: 'Merchandise',
      name: 'merchandiseName',
      options: [],
      placeholder: 'Select a merchandise',
      validation: [Validators.required],
      value: [],
      disabled: true
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
      type: 'button',
    }
  ];

  stockOut: StockOutRequest = {
    shopID: 0,
    merchandiseID: 0,
    number: 0,
    operator: 0
  };

  merchandiseQuery: MerchandiseQuery = {
    barcode: ''
  };
  merchandises: IMerchandiseInfo[];
  temp: any;

  constructor(
    private cd: ChangeDetectorRef,
    private merchandiseService: MerchandiseService    ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.form.config.find(x => x.name === 'shopName').options = this.getShopNameList();
    this.form.config.find(x => x.name === 'merchandiseName').options = this.getMerchandiseNameList();
    this.cd.detectChanges();
    let previousValid = this.form.valid;
    this.form.changes.subscribe(() => {
      if (this.form.valid !== previousValid) {
        previousValid = this.form.valid;
        this.form.setDisabled('submit', !previousValid);
      }
    });
  }

  getCurrentUserName() {
    return this.user.username;
  }

  getShopNameList() {
    return this.shops.map(x => x.name);
  }

  getShopIDList() {
    return this.shops.map(t => t.id);
  }

  getSupplierNameList() {
    return this.suppliers.map(s => s.companyName);
  }

  onSubmit() {
    this.temp = this.form.value;
    this.setValue();
  }

  setValue() {
    this.stockOut.shopID = this.getShopID();
    this.stockOut.merchandiseID = this.getMerchandiseID();
    this.stockOut.number = this.temp.number;
    this.stockOut.operator = this.user.pk;
  }

  getMerchandiseNameList() {
    this.merchandiseService.getInfo(this.merchandiseQuery)
      .subscribe(merchandises => {
        this.merchandises = merchandises;
      });
    return this.merchandises.map(m => m.name);
  }
  getShopID() {
    return this.shops.find(x => x.name === this.temp.shopName).id;
  }

  getMerchandiseID() {
    return this.merchandises.find(x => x.name === this.temp.merchandiseName).id;
  }
}
