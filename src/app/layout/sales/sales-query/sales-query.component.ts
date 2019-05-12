import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DynamicFormComponent } from 'src/app/shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/shared/modules/dynamic-form/models/field-config.interface';

import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';

import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { IMerchandiseInfo } from 'src/app/shared/interfaces/merchandise.interface';
import { EventBusService, Events } from 'src/app/core/services/event-bus.service';

@Component({
  selector: 'app-sales-query',
  templateUrl: './sales-query.component.html',
  styleUrls: ['./sales-query.component.scss']
})
export class SalesQueryComponent implements AfterViewInit {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  merchandises: IMerchandiseInfo[];
  isFound = false;

  config: FieldConfig[] = [
    {
      type: 'input',
      label: '条形码',
      name: 'merchandiseBarcode',
      placeholder: '输入8/9/12/13位数字商品识别码',
      validation: [
        Validators.required,
        Validators.pattern('[0-9]{13}|[0-9]{12}|[0-9]{8}|[0-9]{9}')
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
      label: '查询',
      name: 'submit',
      type: 'button',
      disabled: true
    }
  ];

  constructor(
    private merchandiseService: MerchandiseService,
    private growler: GrowlerService,
    private router: Router,
    private eventBus: EventBusService,
  ) { }

  ngAfterViewInit() {
    this.eventBus.on(Events.MerchandiseBarcodeFound, (merchandises => {
      console.log(merchandises);
      if (merchandises === 'NotFound') {
        this.growler.growl('商品识别码未找到对应商品信息', GrowlerMessageType.Danger);
      } else {
        this.merchandises = merchandises;
        this.updateFormMerchandiseOptions();
      }
    }));

    this.form.changes.subscribe(() => {
      // do barcode query when input is valid
      const barcode = this.form.form.controls['merchandiseBarcode'];
      if (barcode.valid) {
        if (!this.isFound) {
          this.merchandiseService.getInfoByBarcodeFromEvent(barcode.value.trim());
          localStorage.setItem('barcode', barcode.value.trim());
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

  updateFormMerchandiseOptions() {
    this.isFound = true;
    this.form.setDisabled('merchandiseSelected', false);
    this.form.config.find(x => x.name === 'merchandiseSelected').options = this.getMerchandiseNameList();
  }

  getMerchandiseNameList() {
    return this.merchandises.map(x => JSON.stringify(x));
  }

  clearFormMerchandiseOptions() {
    this.isFound = false;
    this.form.config.find(x => x.name === 'merchandiseSelected').options = [];
  }

  onSubmit(value: {[name: string]: any}) {
    const mid = JSON.parse(value['merchandiseSelected']).id;
    this.router.navigate(['/sales/merchandise/' + mid]);
  }
}
