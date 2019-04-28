import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';
import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';
import { BarcodeValidator } from 'src/app/shared/validators/barcode_exist.directive';
import { ISupplier } from 'src/app/shared/interfaces/supplier.interface';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-stock-in',
  templateUrl: './stock-in.component.html',
  styleUrls: ['./stock-in.component.scss']
})
/*export class StockInComponent implements OnInit {

  shops: IShopInfo[] = [];
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
  user: IUserInfo = {
    pk: -1,
    username: ''
  };
  suppliers: ISupplier[] = [];

  createNewMerchandiseEnabled: boolean;
  searchedBarcode: boolean;
  @ViewChild('storeForm') storeForm: NgForm;

  constructor(
    private shopService: ShopService,
    private merchandiseService: MerchandiseService,
    private growler: GrowlerService,
    private userService: UserService,
    private router: Router,
    private supplierService: SupplierService,
    private inventoryService: InventoryService
  ) { }

  ngOnInit() {
    this.getShops();
    this.getUser();
    this.getSuppliers();
  }

  getSuppliers() {
    this.supplierService.list()
      .subscribe(suppliers => {
        this.suppliers = suppliers;
      });
  }

  getShops() {
    this.shopService.list().subscribe(shops => {
      this.shops = shops;
    });
  }


  queryId(event: Event) {
    event.preventDefault();
    this.merchandiseService.getInfo(this.merchandiseQuery)
      .subscribe((merchandises: IMerchandiseInfo[]) => {
        if (merchandises) {
          this.growler.growl('查询成功！', GrowlerMessageType.Success);
          this.merchandises = merchandises;
          this.stockIn.merchandiseID = merchandises.id;
          this.searchedBarcode = true;
        } else {
          this.growler.growl('商品不存在！', GrowlerMessageType.Danger);
          this.stockIn.merchandiseID = 0;
          this.createNewMerchandiseEnabled = true;
        }
      },
      (err: any) => {
        this.growler.growl('Barcode格式错误！', GrowlerMessageType.Danger);
      });
  }

  getUser() {
    this.userService.getUserInfo()
      .subscribe(user => {
        this.user = user;
        this.stockIn.operator = this.user.pk;
      });
  }

  navigate(event: Event) {
    event.preventDefault();
    localStorage.setItem('barcode', this.merchandiseQuery.barcode);
    this.router.navigate(['/stock/add']);
  }

  cancel(event: Event) {
    event.preventDefault();
    this.router.navigate(['/inventory']);
  }

  submit() {
    if (this.searchedBarcode) {
      this.inventoryService.inStock(this.stockIn)
      .subscribe((res: IStockInRequest) => {
          this.storeForm.form.markAsPristine();
          this.router.navigate(['/stock/in']);
          this.searchedBarcode = false;
          this.storeForm.resetForm();
      });
    } else {
      this.growler.growl('Please check the barcode first', GrowlerMessageType.Warning);
    }
  }
} */

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
      label: 'Merchandise',
      name: 'merchandiseBarcode',
      placeholder: 'Input barcode of the merchandise',
      validation: [Validators.required, BarcodeValidator],
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
    }
  ];

  shopNameList: string[];
  shopIDList: number[];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.form.config.find(x => x.name === 'shopName').options = this.getShopNameList();
    this.form.config.find(x => x.name === 'supplierName').options = this.getSupplierNameList();
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

  onSubmit(value: {[name: string]: any}) {
    console.log(value);
  }
}
