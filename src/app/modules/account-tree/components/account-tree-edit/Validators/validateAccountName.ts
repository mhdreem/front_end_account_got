import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
export function validateAccountName( accountTreeService:AccountTreeService,                                    
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
                if (Form.controls['seq'] != null &&
                    Form.controls['seq'].value != null &&
                    Form.controls['seq'].value > 0
                )
                    pk = Form.controls['seq'].value;
            }
    
            //Create Request For Add and Update
    
            let request: accounts_tree = {
                account_name: control.value,
                seq: pk
            }
            return accountTreeService.
            validate_name(request).
                pipe(
                    map(
                        (result: any) => {
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
        };
    }
