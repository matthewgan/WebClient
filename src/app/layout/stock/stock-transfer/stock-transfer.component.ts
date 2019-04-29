import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';

import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';
import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';

import { UserService } from 'src/app/core/services/user.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';
import { IMerchandiseInfo, MerchandiseQuery } from 'src/app/shared/interfaces/merchandise.interface';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss']
})
export class StockTransferComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  shops: IShopInfo[];
  merchandises: IMerchandiseInfo[];
  current_user: IUserInfo;

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
      placeholder: 'Unlock when multiply merchandises found in the database',
      options: [],
      disabled: true,
      value: []
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
      validation: [Validators.required, Validators.min(0)],
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
    // private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // this.eventBus.on(Events.UserChanged, (user => {
    //   this.current_user = user;
    //   this.updateFormOperatorValue();
    // }));
    // this.eventBus.on(Events.ShopListUpdated, (shops => this.shops = shops));

    // this.userService.getUserFromEvent();
    // this.shopService.getShopListFromEvent();
  }

  ngOnDestroy() {

  }

  updateFormOperatorValue() {
    this.form.setValue('operator', this.current_user.username);
    this.form.setDisabled('operator', true);
  }

  updateFormShopOptions() {
    this.form.config.find(x => x.name === 'from_shop').options = this.getShopNameList();
    this.form.config.find(x => x.name === 'to_shop').options = this.getShopNameList();
    // this.cd.detectChanges();
  }

  getShopNameList() {
    return this.shops.map(x => x.name);
  }

  ngAfterViewInit() {
    // this.form.config.find(x => x.name === 'from_shop').options = this.getShopNameList();
    // this.form.config.find(x => x.name === 'to_shop').options = this.getShopNameList();
    // this.cd.detectChanges();
    // let previousValid = this.form.valid;
    // this.form.changes.subscribe(() => {
    //   if (this.form.valid !== previousValid) {
    //     previousValid = this.form.valid;
    //     this.form.setDisabled('submit', !previousValid);
    //   }
    // });

    this.eventBus.on(Events.UserChanged, (user => {
      this.current_user = user;
      this.updateFormOperatorValue();
    }));
    this.eventBus.on(Events.ShopListUpdated, (shops => {
      this.shops = shops;
      this.updateFormShopOptions();
    }));

    this.userService.getUserFromEvent();
    this.shopService.getShopListFromEvent();



    this.form.changes.subscribe(() => {

      const barcode = this.form.form.controls['merchandiseBarcode'];

      if (barcode.valid) {
        this.merchandiseService.getInfo(new MerchandiseQuery());
      }

      if (this.form.valid === true) {
        this.form.setDisabled('submit', false);
      }
    });
  }

  onSubmit(value: {[name: string]: any}) {
    console.log(value);
  }
}
