import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';
import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';
import { BarcodeValidator } from 'src/app/shared/validators/barcode_exist.directive';
import { ISupplier } from 'src/app/shared/interfaces/supplier.interface';
import { IStockInRequest } from 'src/app/shared/interfaces/stock.interface';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { MerchandiseQuery, IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { SELECT_VALUE_ACCESSOR } from '@angular/forms/src/directives/select_control_value_accessor';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-in',
  templateUrl: './stock-in.component.html',
  styleUrls: ['./stock-in.component.scss']
})

export class StockInComponent implements OnInit, AfterViewInit {

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
      label: 'Barcode',
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
      type: 'select',
      label: 'Supplier',
      name: 'supplierName',
      options: [],
      placeholder: 'Select a supplier',
      validation: [Validators.required],
      value: []
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
      disabled: true
    }
  ];

  stockIn: IStockInRequest = {
    shopID: 0,
    merchandiseID: 0,
    number: 0,
    supplierID: 0,
    operator: 0
  };
  merchandiseQuery: MerchandiseQuery = {
    barcode: ''
  };
  merchandises: IMerchandiseInfo[];
  temp: any;

  constructor(
    private cd: ChangeDetectorRef,
    private merchandiseService: MerchandiseService,
    private growlService: GrowlerService,
    private router: Router,
    private inventoryService: InventoryService
    ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.form.config.find(x => x.name === 'shopName').options = this.getShopNameList();
    this.form.config.find(x => x.name === 'supplierName').options = this.getSupplierNameList();
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
    this.stockIn.operator = this.user.pk;
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

  getMerchandiseNameList() {
    this.merchandiseService.getInfo(this.merchandiseQuery)
      .subscribe(merchandises => {
        this.merchandises = merchandises;
      });
    return this.merchandises.map(m => m.name);
  }

  onSubmit() {
    this.temp = this.form.value;
    this.setValue();
    this.inventoryService.inStock(this.stockIn)
      .subscribe((res: IStockInRequest) => {
        if (res) {
          this.growlService.growl('添加成功', GrowlerMessageType.Success);
          this.router.navigate(['/stock/in']);
        } else {
          this.growlService.growl('添加失败', GrowlerMessageType.Danger);
        }
      });
  }

  setValue() {
    this.stockIn.shopID = this.getShopID();
    this.stockIn.merchandiseID = this.getMerchandiseID();
    this.stockIn.number = this.temp.number;
    this.stockIn.supplierID = this.getSupplierID();
  }

  getShopID() {
    return this.shops.find(x => x.name === this.temp.shopName).id;
  }

  getMerchandiseID() {
    return this.merchandises.find(x => x.name === this.temp.merchandiseName).id;
  }

  getSupplierID() {
    return this.suppliers.find(x => x.companyName === this.temp.supplierName).id;
  }
}
