import {ValidatorFn, AbstractControl} from '@angular/forms';

export function BarcodeValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const regex = /^\d(13)$/ ;
        const valid = regex.test(control.value);
        return valid ? {'barcode': {value: control.value}} : null;
    };
}
