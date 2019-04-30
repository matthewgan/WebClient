import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';
import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';
import { ISupplier } from 'src/app/shared/interfaces/supplier.interface';
import { IStockInRequest } from 'src/app/shared/interfaces/stock.interface';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { MerchandiseQuery, IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { Router } from '@angular/router';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';
import { UserService } from 'src/app/core/services/user.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { SupplierService } from 'src/app/core/services/supplier.service';

@Component({
  selector: 'app-stock-in',
  templateUrl: './stock-in.component.html',
  styleUrls: ['./stock-in.component.scss']
})

export class StockInComponent implements OnInit, AfterViewInit {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  shops: IShopInfo[];
  user: IUserInfo;
  suppliers: ISupplier[];
  merchandises: IMerchandiseInfo[];
  temp: any;

  config: FieldConfig[] = [
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
      label: 'Barcode',
      name: 'merchandiseBarcode',
      placeholder: 'Input barcode of the merchandise',
      validation: [Validators.required, Validators.pattern('[0-9]{13}')]
    },
    {
      type: 'select',
      label: 'Merchandise',
      name: 'merchandiseName',
      options: [],
      placeholder: 'Select a merchandise',
      validation: [Validators.required],
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
      name: 'supplier',
      options: [],
      placeholder: 'Select a supplier',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: 'operator',
      name: 'operator',
      disabled: true,
      value: '',
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


  constructor(
    // private cd: ChangeDetectorRef,
    private merchandiseService: MerchandiseService,
    private growlService: GrowlerService,
    private router: Router,
    private inventoryService: InventoryService,
    private eventBus: EventBusService,
    private userService: UserService,
    private shopService: ShopService,
    private supplierService: SupplierService,
    ) {}

  ngOnInit() {}

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

    // call the service to make sure emit events
    this.userService.getUserFromEvent();
    this.shopService.getShopListFromEvent();
    this.supplierService.getSupplierListFromEvent();

    this.form.changes.subscribe(() => {

      if (this.form.valid === true) {
        this.form.setDisabled('submit', false);
      } else {
        this.form.setDisabled('submit', true);
      }
    });
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
    return this.shops.map(x => x.name);
  }

  getSupplierNameList() {
    return this.suppliers.map(x => x.companyName);
  }

  // getMerchandiseNameList() {
  //   this.merchandiseService.getInfo(this.merchandiseQuery)
  //     .subscribe(merchandises => {
  //       this.merchandises = merchandises;
  //     });
  //   return this.merchandises.map(m => m.name);
  // }

  onSubmit() {
    this.temp = this.form.value;
    // this.setValue();
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

  // setValue() {
  //   this.stockIn.shopID = this.getShopID();
  //   this.stockIn.merchandiseID = this.getMerchandiseID();
  //   this.stockIn.number = this.temp.number;
  //   this.stockIn.supplierID = this.getSupplierID();
  //   this.stockIn.operator = this.user.pk;
  // }

  // getShopID() {
  //   return this.shops.find(x => x.name === this.temp.shopName).id;
  // }

  // getMerchandiseID() {
  //   return this.merchandises.find(x => x.name === this.temp.merchandiseName).id;
  // }

  // getSupplierID() {
  //   return this.suppliers.find(x => x.companyName === this.temp.supplierName).id;
  // }
}
