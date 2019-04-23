import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IStockInRequest } from 'src/app/shared/interfaces/stock.interface';
import { IShopInfo } from 'src/app/shared/interfaces/shop.interface';
import { ShopService } from 'src/app/core/services/shop.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { MerchandiseQuery, IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';
import { IUserInfo } from 'src/app/shared/interfaces/user.interface';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';
import { SupplierService } from 'src/app/core/services/supplier.service';
import { ISupplier } from 'src/app/shared/interfaces/supplier.interface';
import { InventoryService } from 'src/app/core/services/inventory.service';

@Component({
  selector: 'app-stock-in',
  templateUrl: './stock-in.component.html',
  styleUrls: ['./stock-in.component.scss']
})
export class StockInComponent implements OnInit {

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
  merchandise: IMerchandiseInfo;
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

/*   getChange(id: number) {
    console.log('=========');
    console.log(id);
  } */

  queryId(event: Event) {
    event.preventDefault();
    this.merchandiseService.getInfo(this.merchandiseQuery)
      .subscribe((merchandise: IMerchandiseInfo) => {
        if (merchandise) {
          this.growler.growl('查询成功！', GrowlerMessageType.Success);
          this.merchandise = merchandise;
          this.stockIn.merchandiseID = merchandise.id;
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
}
