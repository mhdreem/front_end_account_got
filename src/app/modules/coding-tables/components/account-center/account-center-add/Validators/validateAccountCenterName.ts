import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
export function validateAccountCenterName( accountCenterService:account_centerService,                                    
                                            name:string|null,) : AsyncValidatorFn
        {

            return (control: AbstractControl)
            : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

            let value_From_Control: string = control.value;
            if (!value_From_Control ||
                value_From_Control.length == 0
            )
            return of(null);

            return accountCenterService.
                validate_name({account_center_name: value_From_Control}).
                pipe(
                    map(
                        (result: any) => {
                            console.log('result', result);
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
        };
    }
