import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
    selector: 'form-search',
    // templateUrl: './name.component.html',
    styleUrls: ['./form-search.component.scss'],
    template: `
    <div
      class="dynamic-field form-search"
      [formGroup]="group">
      <button
        [disabled]="config.disabled"
        type="search">
        {{ config.label }}
      </button>
    </div>
    `
})
export class FormSearchComponent implements Field {
    config: FieldConfig;
    group: FormGroup;
}
