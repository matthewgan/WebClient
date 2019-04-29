import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { MerchandiseCreateRequest, IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { Router } from '@angular/router';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';

@Component({
  selector: 'app-merchandise-add',
  templateUrl: './merchandise-add.component.html',
  styleUrls: ['./merchandise-add.component.scss']
})
export class MerchandiseAddComponent implements OnInit, AfterViewInit {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  categories: ICategory[] = JSON.parse(sessionStorage.getItem('categories'));

  config: FieldConfig[] = [
    {
      type: 'input',
      label: 'Barcode',
      name: 'merchandiseBarcode',
      disabled: true,
      value: this.getBarcode()
    },
    {
      type: 'select',
      label: 'Category',
      name: 'categoryName',
      options: [],
      placeholder: 'Select a category',
      validation: [Validators.required],
      value: []
    },
    {
      type: 'input',
      label: 'Merchandise Name',
      name: 'name',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: 'Merchandise Brand',
      name: 'brand',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: 'Merchandise Scale',
      name: 'scale',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: 'Merchandise Factory',
      name: 'factory',
      validation: [Validators.required],
    },
    {
      type: 'input',
      label: 'Merchandise Unit',
      name: 'unit',
      validation: [Validators.required],
    },
    {
      label: 'Submit',
      name: 'submit',
      type: 'button',
    }
  ];

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
  temp: any;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private merchandiseService: MerchandiseService,
    private growlService: GrowlerService
    ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.form.config.find(x => x.name === 'categoryName').options = this.getCategoryNameList();
    this.cd.detectChanges();
    let previousValid = this.form.valid;
    this.form.changes.subscribe(() => {
      if (this.form.valid !== previousValid) {
        previousValid = this.form.valid;
        this.form.setDisabled('submit', !previousValid);
      }
    });
  }

  getBarcode() {
    return '1234';
  }

  getCategoryNameList() {
    return this.categories.map(x => x.name);
  }

  onSubmit() {
    this.temp = this.form.value;
    this.setValue();
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
  setValue() {
    this.merchandise.barcode = this.getBarcode();
    this.merchandise.name = this.temp.name;
    this.merchandise.brand = this.temp.brand;
    this.merchandise.scale = this.temp.scale;
    this.merchandise.factory = this.temp.factory;
    this.merchandise.unit = this.temp.unit;
    this.merchandise.categoryID = this.getCategoryID();
  }

  getCategoryID() {
    return this.categories.find(x => x.name === this.temp.categoryName).id;
  }


}
