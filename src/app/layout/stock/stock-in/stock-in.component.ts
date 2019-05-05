import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';

import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';
import { ISupplier } from 'src/app/shared/interfaces/supplier.interface';
import { IStockInRequest } from 'src/app/shared/interfaces/stock.interface';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';
import { UserService } from 'src/app/core/services/user.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { SupplierService } from 'src/app/core/services/supplier.service';

@Component({
  selector: 'app-stock-in',
  templateUrl: './stock-in.component.html',
  styleUrls: ['./stock-in.component.scss']
})

export class StockInComponent implements AfterViewInit {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  shops: IShopInfo[];
  user: IUserInfo;
  suppliers: ISupplier[];
  merchandises: IMerchandiseInfo[];
  isFound = false;
  record: IStockInRequest = {
    shopID: 0,
    merchandiseID: 0,
    number: 0,
    supplierID: 0,
    operator: 0
  };

  config: FieldConfig[] = [
    {
      type: 'input',
      label: 'Merchandise',
      name: 'merchandiseBarcode',
      placeholder: 'Input barcode of the merchandise',
      validation: [
        Validators.required,
        Validators.pattern('[0-9]{13}')
      ],
      value: localStorage.getItem('barcode')
    },
    {
      type: 'select',
      label: 'Select Merchandise',
      name: 'merchandiseSelected',
      options: [],
      disabled: true,
      validation: [Validators.required],
    },
    {
      type: 'select',
      label: 'Shop',
      name: 'shop',
      options: [],
      placeholder: 'Select a shop',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: 'number',
      name: 'number',
      validation: [
        Validators.required,
        Validators.pattern('[0-9]+'),
        Validators.min(1)
      ],
      value: 0
    },
    {
      type: 'select',
      label: 'Supplier',
      name: 'supplier',
      options: [],
      placeholder: 'Select a supplier',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: 'operator',
      name: 'operator',
      disabled: false,
      validation: [Validators.required],
      value: ''
    },
    {
      label: 'Submit',
      name: 'submit',
      type: 'button',
      disabled: true
    }
  ];

  constructor(
    // private cd: ChangeDetectorRef,
    private merchandiseService: MerchandiseService,
    private growler: GrowlerService,
    private router: Router,
    private inventoryService: InventoryService,
    private eventBus: EventBusService,
    private userService: UserService,
    private shopService: ShopService,
    private supplierService: SupplierService,
    public modalService: NgxSmartModalService,
    ) {}

  updateFormMerchandiseOptions() {
    this.isFound = true;
    this.form.setDisabled('merchandiseSelected', false);
    this.form.config.find(x => x.name === 'merchandiseSelected').options = this.getMerchandiseNameList();
  }

  updateFormOperatorValue() {
    this.form.setValue('operator', this.user.username);
    this.form.setDisabled('operator', true);
  }

  updateFormShopOptions() {
    this.form.config.find(x => x.name === 'shop').options = this.getShopNameList();
  }

  updateFormSupplierOptions() {
    this.form.config.find(x => x.name === 'supplier').options = this.getSupplierNameList();
  }

  getShopNameList() {
    return this.shops.map(x => JSON.stringify(x));
  }

  getMerchandiseNameList() {
    return this.merchandises.map(x => JSON.stringify(x));
  }

  getSupplierNameList() {
    return this.suppliers.map(x => JSON.stringify(x));
  }

  clearFormMerchandiseOptions() {
    this.isFound = false;
    this.form.config.find(x => x.name === 'merchandiseSelected').options = [];
    // this.form.setDisabled('merchandiseSelected', true);
  }

  // showModalChoice(): Promise<boolean> | boolean {
  //   const modalContent: IModalContent = {
  //     header: 'Create New Merchandise?',
  //     body: 'The barcode is not found, do you want to create a new item?',
  //     cancelButtonText: 'Cancel',
  //     OKButtonText: 'Create Merchandise'
  //   };
  //   return this.modalService.show(modalContent);
  // }

  ngAfterViewInit() {
    // Subscription to events provided by all the services
    this.eventBus.on(Events.UserChanged, (user => {
      this.user = user;
      this.updateFormOperatorValue();
    }));
    this.eventBus.on(Events.ShopListUpdated, (shops => {
      this.shops = shops;
      this.updateFormShopOptions();
    }));
    this.eventBus.on(Events.SupplierListUpdated, (suppliers => {
      this.suppliers = suppliers;
      this.updateFormSupplierOptions();
    }));
    this.eventBus.on(Events.MerchandiseBarcodeFound, (merchandises => {
      console.log(merchandises);
      if (merchandises === 'NotFound') {
        // to do: create new merchandise modal
        this.modalService.getModal('newMerchandise').open(true);
      } else {
        this.merchandises = merchandises;
        this.updateFormMerchandiseOptions();
      }
    }));

    // call the service to make sure emit events
    this.userService.getUserFromEvent();
    this.shopService.getShopListFromEvent();
    this.supplierService.getSupplierListFromEvent();

    this.form.changes.subscribe(() => {
      // do barcode query when input is valid
      const barcode = this.form.form.controls['merchandiseBarcode'];
      if (barcode.valid) {
        if (!this.isFound) {
          this.merchandiseService.getInfoByBarcodeFromEvent(barcode.value.trim());
          localStorage.setItem('barcode', barcode.value.trim());
        }
      } else {
        this.clearFormMerchandiseOptions();
      }

      if (this.form.valid === true) {
        this.form.setDisabled('submit', false);
      } else {
        this.form.setDisabled('submit', true);
      }
    });
  }

  onSubmit(value: {[name: string]: any}) {

    this.record.operator = this.user.pk;
    this.record.merchandiseID = JSON.parse(value['merchandiseSelected']).id;
    // tslint:disable-next-line:radix
    this.record.number = parseInt(value['number']);
    this.record.shopID = JSON.parse(value['shop']).id;
    this.record.supplierID = JSON.parse(value['supplier']).id;

    // console.log(this.record);
    this.inventoryService.inStock(this.record).subscribe(
      resp => {
        if (resp.status === 201) {
          console.log(resp.body);
          this.growler.growl('OK', GrowlerMessageType.Success);
          localStorage.removeItem('barcode');
          this.form.form.reset();
        } else {

        }
      }
    );

  }
}
