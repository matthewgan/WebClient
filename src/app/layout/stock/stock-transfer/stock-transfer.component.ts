import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';

import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';
import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';

import { UserService } from 'src/app/core/services/user.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';
import { StockTransferRequest } from 'src/app/shared/interfaces/stock.interface';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';
import { IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss']
})
export class StockTransferComponent implements AfterViewInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  shops: IShopInfo[];
  merchandises: IMerchandiseInfo[];
  isFound = false;
  user: IUserInfo;
  record: StockTransferRequest = {
    fromShop: 0,
    toShop: 0,
    merchandiseID: 0,
    number: 0,
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
    },
    {
      type: 'select',
      label: 'Select Merchandise',
      name: 'merchandiseSelected',
      options: [],
      disabled: true,
    },
    {
      type: 'select',
      label: 'from Shop',
      name: 'from_shop',
      options: [],
      placeholder: 'Select a shop',
      validation: [Validators.required],
    },
    {
      type: 'select',
      label: 'to Shop',
      name: 'to_shop',
      options: [],
      placeholder: 'Select a shop',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: 'number',
      name: 'number',
      validation: [Validators.required, Validators.min(1)],
      value: 0
    },
    {
      type: 'input',
      label: 'operator',
      name: 'operator',
      disabled: false,
      validation: [Validators.required],
      value: '',
    },
    {
      label: 'Submit',
      name: 'submit',
      type: 'button',
      disabled: true
    }
  ];

  constructor(
    private userService: UserService,
    private shopService: ShopService,
    private eventBus: EventBusService,
    private merchandiseService: MerchandiseService,
    private inventoryService: InventoryService,
    // private cd: ChangeDetectorRef,
  ) {}

  updateFormOperatorValue() {
    this.form.setValue('operator', this.user.username);
    this.form.setDisabled('operator', true);
  }

  updateFormShopOptions() {
    this.form.config.find(x => x.name === 'from_shop').options = this.getShopNameList();
    this.form.config.find(x => x.name === 'to_shop').options = this.getShopNameList();
  }

  updateFormMerchandiseOptions() {
    this.isFound = true;
    this.form.setDisabled('merchandiseSelected', false);
    this.form.config.find(x => x.name === 'merchandiseSelected').options = this.getMerchandiseNameList();
  }

  clearFormMerchandiseOptions() {
    this.isFound = false;
    this.form.config.find(x => x.name === 'merchandiseSelected').options = [];
    // this.form.setDisabled('merchandiseSelected', true);
  }

  getShopNameList() {
    return this.shops.map(x => x.name);
  }

  getMerchandiseNameList() {
    return this.merchandises.map(x => x.name);
  }

  ngAfterViewInit() {
    this.eventBus.on(Events.UserChanged, (user => {
      this.user = user;
      this.updateFormOperatorValue();
    }));
    this.eventBus.on(Events.ShopListUpdated, (shops => {
      this.shops = shops;
      this.updateFormShopOptions();
    }));
    this.eventBus.on(Events.MerchandiseBarcodeFound, (merchandises => {
      this.merchandises = merchandises;
      this.updateFormMerchandiseOptions();
    }));

    this.userService.getUserFromEvent();
    this.shopService.getShopListFromEvent();

    this.form.changes.subscribe(() => {
      // do barcode query when input is valid
      const barcode = this.form.form.controls['merchandiseBarcode'];
      if (barcode.valid) {
        if (!this.isFound) {
          this.merchandiseService.getInfoByBarcodeFromEvent(barcode.value);
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
    console.log(value);
    // console.log(this.shopService.getShopIdByName(value['from_shop'], this.shops));
    this.record.fromShop = this.shopService.getIdByName(value['from_shop'], this.shops);
    this.record.toShop = this.shopService.getIdByName(value['to_shop'], this.shops);
    this.record.operator = this.user.pk;
    this.record.merchandiseID = this.merchandiseService.getIdByName(value['merchandiseSelected'], this.merchandises);
  }
}
