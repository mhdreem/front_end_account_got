import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { of } from 'rxjs';
import { account_class } from 'src/app/modules/shared/models/account_class';
import { BeneficiaryTypeService } from 'src/app/modules/shared/services/beneficiary-type.service';
import { BeneficiaryType } from 'src/app/modules/shared/models/beneficiary-type';

export function validateBeneficiaryTypeCode( beneficiaryTypeService:BeneficiaryTypeService,                                    
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
            if (Form.controls['beneficiary_type_seq'] != null &&
                Form.controls['beneficiary_type_seq'].value != null &&
                Form.controls['beneficiary_type_seq'].value > 0
            )
                pk = Form.controls['beneficiary_type_seq'].value;
        }

        //Create Request For Add and Update

        let request: BeneficiaryType = {
            beneficiary_type_code: control.value,
            beneficiary_type_seq: pk
        }

            return beneficiaryTypeService.
            validate_name(request).
                pipe(
                    map(
                        (result: any) => {
                            console.log('222', result);
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
        };
    }
