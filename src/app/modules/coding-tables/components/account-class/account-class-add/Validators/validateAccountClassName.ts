import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountClassService } from 'src/app/modules/shared/services/account-class.service';
import { of } from 'rxjs';

export function validateAccountClassName( accountClassService:AccountClassService,                                    
                                            name:string|null,) : AsyncValidatorFn
        {

            return (control: AbstractControl)
            : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

            let value_From_Control: string = control.value;
            if (!value_From_Control ||
                value_From_Control.length == 0
            )
            return of(null);

            return accountClassService.
            validate_name({
                "account_class_name": value_From_Control}).
                pipe(
                    map(
                        (result: any) => {
                            console.log('222', result);
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
        };
    }
