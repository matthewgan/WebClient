import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';
import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';

import { GrowlerMessageType, GrowlerService } from 'src/app/core/growler/growler.service';

import { UserService } from 'src/app/core/services/user.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';
import { StockTransferRequest } from 'src/app/shared/interfaces/stock.interface';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';
import { IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { InventoryService } from 'src/app/core/services/inventory.service';

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
      label: '条形码',
      name: 'merchandiseBarcode',
      placeholder: 'Input barcode of the merchandise',
      validation: [
        Validators.required,
        Validators.pattern('[0-9]{13}')
      ],
    },
    {
      type: 'select',
      label: '选择商品',
      name: 'merchandiseSelected',
      options: [],
      disabled: true,
      validation: [Validators.required],
    },
    {
      type: 'select',
      label: '转出店铺',
      name: 'from_shop',
      options: [],
      placeholder: 'Select a shop',
      validation: [Validators.required],
    },
    {
      type: 'select',
      label: '转入店铺',
      name: 'to_shop',
      options: [],
      placeholder: 'Select a shop',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '数量',
      name: 'number',
      validation: [Validators.required, Validators.min(1)],
      value: 0
    },
    {
      type: 'input',
      label: '操作员',
      name: 'operator',
      disabled: false,
      validation: [Validators.required],
      value: '',
    },
    {
      label: '提交',
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
    private growler: GrowlerService,
    private router: Router,
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
          this.merchandiseService.getInfoByBarcodeFromEvent(barcode.value.trim());
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
    // console.log(value);
    this.record.fromShop = JSON.parse(value['from_shop']).id;
    this.record.toShop = JSON.parse(value['to_shop']).id;
    this.record.operator = this.user.pk;
    this.record.merchandiseID = JSON.parse(value['merchandiseSelected']).id;
    this.record.number = value['number'];

    this.inventoryService.transferStock(this.record).subscribe(
      resp => {
        if (resp.status === 204) {
          console.log(resp.statusText);
          console.log(resp.body);
        } else if (resp.status === 200) {
          console.log(resp);
        }
      }
    );
  }
}
