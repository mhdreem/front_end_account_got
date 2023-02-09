import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { DepartmentService } from 'src/app/modules/shared/services/department.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
export function validateUserName( userService:UserService,                                    
                                    name:string|null,) : AsyncValidatorFn
        {

            return (control: AbstractControl)
            : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

            let value_From_Control: string = control.value;
            if (!value_From_Control ||
                value_From_Control.length == 0
            )
            return of(null);

            return userService.
            validate_name({
                    "user_name": value_From_Control}
                ).
                pipe(
                    map(
                        (result: any) => {
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
        };
    }
