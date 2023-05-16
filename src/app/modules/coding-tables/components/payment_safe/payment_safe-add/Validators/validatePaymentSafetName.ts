import { FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { PaymentSafeService } from 'src/app/modules/shared/services/payment_safe.service';
import { payment_safe } from 'src/app/modules/shared/models/payment_safe';

export function validatePaymentSafetName( PaymentSafeService:PaymentSafeService,                                    
                                            name:string|null,) : AsyncValidatorFn
        {

            return (control: AbstractControl)
            : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

            let value_From_Control: string = control.value;
            if (!value_From_Control ||
                value_From_Control.length == 0
            )
            return of(null);

                // Define Primart Key Variable
let pk: number | undefined = undefined;

let Form: FormGroup = control.parent as FormGroup;
if (Form != null && Form.value != null) {
    if (Form.controls['payment_safe_seq'] != null &&
        Form.controls['payment_safe_seq'].value != null &&
        Form.controls['payment_safe_seq'].value > 0
    )
        pk = Form.controls['payment_safe_seq'].value;
}
 
//Create Request For Add and Update

let request: payment_safe = {
    payment_safe_name: control.value,
    payment_safe_seq: pk
}

            return PaymentSafeService.
            validate_name(request).
                pipe(
                    map(
                        (result: any) => {
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
        };
    }
