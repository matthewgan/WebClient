import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { MerchandiseCreateRequest, IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { Router } from '@angular/router';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-merchandise-add',
  templateUrl: './merchandise-add.component.html',
  styleUrls: ['./merchandise-add.component.scss']
})
export class MerchandiseAddComponent implements OnInit, AfterViewInit {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  categories: ICategory[];

  merchandise: MerchandiseCreateRequest = {
    code: '',
    barcode: '',
    categoryID: 0,
    name: '',
    brand: '',
    scale: '',
    factory: '',
    unit: ''
  };

  config: FieldConfig[] = [
    {
      type: 'input',
      label: '店内码',
      name: 'code',
      validation: [
        Validators.required,
        Validators.pattern('[0-9]+')
      ]
    },
    {
      type: 'input',
      label: '商品识别码',
      name: 'barcode',
      placeholder: '输入13位数字商品识别码',
      validation: [
        Validators.required,
        Validators.pattern('[0-9]{13}')
      ],
      value: localStorage.getItem('barcode')
    },
    {
      type: 'select',
      label: '分类',
      name: 'category',
      options: [],
      placeholder: '选择商品分类',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '商品名称',
      name: 'name',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: '品牌',
      name: 'brand',
      value: '',
    },
    {
      type: 'input',
      label: '容量',
      name: 'scale',
      value: '',
    },
    {
      type: 'input',
      label: '生产厂商',
      name: 'factory',
      value: '',
    },
    {
      type: 'input',
      label: '计量单位',
      name: 'unit',
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
    // private cd: ChangeDetectorRef,
    private router: Router,
    private merchandiseService: MerchandiseService,
    private growlService: GrowlerService,
    private eventBus: EventBusService,
    private categoryService: CategoryService,
    public modalService: NgxSmartModalService,
    ) {}

  ngOnInit() {
    try {
      this.modalService.getModal('newMerchandise').close();
    }
    finally {}
  }

  ngAfterViewInit() {
    // this.form.config.find(x => x.name === 'categoryName').options = this.getCategoryNameList();
    // this.cd.detectChanges();
    // let previousValid = this.form.valid;
    // this.form.changes.subscribe(() => {
    //   if (this.form.valid !== previousValid) {
    //     previousValid = this.form.valid;
    //     this.form.setDisabled('submit', !previousValid);
    //   }
    // });

    this.eventBus.on(Events.CategoryListUpdated, (categories) => {
      this.categories = categories;
      this.updateCategoryOptions();
    });

    this.categoryService.getCategoryListFromEvent();

    this.form.changes.subscribe(() => {
      if (this.form.valid === true) {
        this.form.setDisabled('submit', false);
      } else {
        this.form.setDisabled('submit', true);
      }
    });
  }

  updateCategoryOptions() {
    this.form.config.find(x => x.name === 'category').options = this.getCategoryNameList();
  }

  getCategoryNameList() {
    // return this.categories.map(x => x.name);
    return this.categories.map(x => JSON.stringify(x));
  }

  onSubmit(value: {[name: string]: any}) {
    // this.temp = this.form.value;
    // this.setValue();
    console.log(value);

    this.merchandise.code = value['code'].trim();
    this.merchandise.barcode = value['barcode'].trim();
    this.merchandise.factory = value['factory'].trim();
    this.merchandise.name = value['name'].trim();
    this.merchandise.scale = value['scale'].trim();
    this.merchandise.unit = value['unit'].trim();
    this.merchandise.brand = value['brand'].trim();
    this.merchandise.categoryID = JSON.parse(value['category']).id;

    this.merchandiseService.add(this.merchandise)
      .subscribe((createdMerchandise: IMerchandiseInfo) => {
        if (createdMerchandise) {
          this.growlService.growl('添加成功', GrowlerMessageType.Success);
          this.router.navigate(['/stock/in']);
        } else {
          this.growlService.growl('添加失败', GrowlerMessageType.Danger);
        }
      });
  }
}
