import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
export function validateAccountName( accountTreeService:AccountTreeService,                                    
                                            ) : AsyncValidatorFn
        {

            return (control: AbstractControl)
            : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

            let value_From_Control: string = control.value;
            if ( value_From_Control == null ||value_From_Control.length == 0 )
                return of(null);

            return accountTreeService.
            validate_name({account_name: value_From_Control}).
                pipe(
                    map(
                        (result: any) => {
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
        };
    }
