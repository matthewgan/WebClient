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
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';
import { Router } from '@angular/router';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';
import { UserService } from 'src/app/core/services/user.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { SupplierService } from 'src/app/core/services/supplier.service';

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
      name: 'shop',
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
      validation: [Validators.required, Validators.pattern('[0-9]{13}')],
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
      value: '',
    },
    {
      label: 'Submit',
      name: 'submit',
      type: 'button',
      disabled: true
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
    private merchandiseService: MerchandiseService,
    private growlService: GrowlerService,
    private router: Router,
    private inventoryService: InventoryService,
    private eventBus: EventBusService,
    private userService: UserService,
    private shopService: ShopService,
    private supplierService: SupplierService
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
        this.form.setDisabled('submit', false);
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

  getShopIDList() {
    return this.shops.map(t => t.id);
  }

  getSupplierNameList() {
    return this.suppliers.map(s => s.companyName);
  }

  onSubmit() {
    this.setValue();
    this.inventoryService.outStock(this.stockOut)
      .subscribe((res: StockOutRequest) => {
        if (res) {
          this.growlService.growl('添加成功', GrowlerMessageType.Success);
          this.router.navigate(['/stock/in']);
        } else {
          this.growlService.growl('添加失败', GrowlerMessageType.Warning);
        }
      },
      (err: any) => this.growlService.growl('请正确填写所有位置', GrowlerMessageType.Danger));
  }

  setValue() {
    this.stockOut.shopID = this.shops.find(s => s.name === this.form.value.shop).id;
    // this.stockOut.merchandiseID = this.merchandises.find(m => m.name === this.form.value.merchandiseName).id;
    this.stockOut.number = this.form.value.number;
    // this.stockOut.supplierID = this.suppliers.find(sp => sp.companyName === this.form.value.supplier).id;
    this.stockOut.operator = this.user.pk;
  }

  // getMerchandiseNameList() {
  //   this.merchandiseService.getInfo(this.merchandiseQuery)
  //     .subscribe(merchandises => {
  //       this.merchandises = merchandises;
  //     });
  //   return this.merchandises.map(m => m.name);
  // }
/*   getShopID() {
    return this.shops.find(x => x.name === this.temp.shopName).id;
  }

  getMerchandiseID() {
    return this.merchandises.find(x => x.name === this.temp.merchandiseName).id;
  } */
}
