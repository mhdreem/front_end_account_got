import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { account_center } from 'src/app/modules/shared/models/account_center';
export function validateAccountCenterName( accountCenterService:account_centerService,                                    
                                            ) : AsyncValidatorFn
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
            if (Form.controls['account_center_seq'] != null &&
                Form.controls['account_center_seq'].value != null &&
                Form.controls['account_center_seq'].value > 0
            )
                pk = Form.controls['account_center_seq'].value;
        }

        //Create Request For Add and Update

        let request: account_center = {
            account_center_id: control.value,
            account_center_seq: pk
        }
                    return accountCenterService.
                    validate_name(request).
                    pipe(
                        map(
                            (result: any) => {
                                console.log('result', result);
                                return (result && result.value) ? { "duplicate": true } : null;
                            }
                        ));
           
               
            }

            
    }
