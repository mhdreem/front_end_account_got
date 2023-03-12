import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { DepartmentService } from 'src/app/modules/shared/services/department.service';
import { of } from 'rxjs';
import { ExchangeOrderStageService } from 'src/app/modules/shared/services/exchange-order-stage.service';
import { exchange_order_stage } from 'src/app/modules/shared/models/exchange_order_stage';

export function validateExOrdStgName( exchangeOrderStageService:ExchangeOrderStageService,                                    
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
    if (Form.controls['ex_ord_stg_seq'] != null &&
        Form.controls['ex_ord_stg_seq'].value != null &&
        Form.controls['ex_ord_stg_seq'].value > 0
    )
        pk = Form.controls['ex_ord_stg_seq'].value;
}
 
//Create Request For Add and Update

let request: exchange_order_stage = {
    ex_ord_stg_name: control.value,
    ex_ord_stg_seq: pk
}

            return exchangeOrderStageService.
            validate_name(request).
                pipe(
                    map(
                        (result: any) => {
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
        };
    }
