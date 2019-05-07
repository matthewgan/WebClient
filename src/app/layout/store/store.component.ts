import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { IShopInfo, ShopCreateRequest } from 'src/app/shared/interfaces/shop.interface';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShopService } from 'src/app/core/services/shop.service';
import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
  animations: [routerTransition()]
})
/* export class StoreComponent implements OnInit {

  store: IShopCreateRequest = {
    name: '',
    city: '',
    capacity: 0
  };

  errorMessage: string;
  operationText = 'Submit';
  @ViewChild('storeForm') storeForm: NgForm;

  constructor(
    private router: Router,
    private dataService: ShopService
  ) { }

  ngOnInit() {
  }

  submit() {
    this.dataService.add(this.store)
      .subscribe((createdStore: IShopInfo) => {
        if (createdStore) {
          this.storeForm.form.markAsPristine();
          this.router.navigate(['/stores']);
        } else {
          const msg = 'Unable to add store';
          this.errorMessage = msg;
        }
      });
  }

  cancel(event: Event) {
    event.preventDefault();
    // Route guard will take care of showing modal dialog service if data is dirty
    this.router.navigate(['/stores']);
  }

} */

export class StoreComponent implements AfterViewInit {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  config: FieldConfig[] = [
    {
      type: 'input',
      label: '店铺名称',
      name: 'name',
      placeholder: 'Input a shop name',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '城市',
      name: 'city',
      placeholder: 'Input a city',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '地址',
      name: 'locationDetail',
      placeholder: 'Input detail of location',
      validation: [Validators.required],
      value: ''
    },
    {
      type: 'input',
      label: '面积',
      name: 'size',
      placeholder: 'Input size of shop',
      validation: [Validators.required, Validators.pattern('[0-9.]+')],
      value: 100
    },
    {
      label: '提交',
      name: 'submit',
      type: 'button',
      disabled: true,
    }
  ];

  shop: ShopCreateRequest;

  constructor(
    // private cd: ChangeDetectorRef,
    private shopService: ShopService,
    private growlService: GrowlerService,
    private router: Router
    ) {}

  ngAfterViewInit() {
    // this.cd.detectChanges();
    // let previousValid = this.form.valid;
    // this.form.changes.subscribe(() => {
    //   if (this.form.valid !== previousValid) {
    //     previousValid = this.form.valid;
    //     this.form.setDisabled('submit', !previousValid);
    //   }
    // });

    this.form.changes.subscribe(() => {
      if (this.form.valid === true) {
        this.form.setDisabled('submit', false);
      } else {
        this.form.setDisabled('submit', true);
      }
    });

  }

  onSubmit(value: {[name: string]: any}) {
    // console.log(this.form.value);
    // this.shop = this.form.value;
    // console.log(this.shop);
    // this.shopService.add(this.shop)
    //   .subscribe((createdShop: IShopInfo) => {
    //     if (createdShop) {
    //       this.growlService.growl('添加成功', GrowlerMessageType.Success);
    //       this.router.navigate(['/stores']);
    //     } else {
    //       this.growlService.growl('添加失败', GrowlerMessageType.Danger);
    //     }
    //   });

    this.shop.name = value['name'].trim();
    this.shop.city = value['city'].trim();
    this.shop.locationDetail = value['locationDetail'].trim();
    this.shop.size = value['size'].trim();

    this.shopService.add(this.shop).subscribe((createdShop: IShopInfo) => {
      if (createdShop) {
        this.growlService.growl('添加成功', GrowlerMessageType.Success);
        this.router.navigate(['/stores']);
      } else {
        this.growlService.growl('添加失败', GrowlerMessageType.Danger);
      }
    });
  }
}
