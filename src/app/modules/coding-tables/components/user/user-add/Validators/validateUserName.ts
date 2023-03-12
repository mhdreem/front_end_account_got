import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { user } from 'src/app/modules/shared/models/user';
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

                // Define Primart Key Variable
let pk: number | undefined = undefined;

let Form: FormGroup = control.parent as FormGroup;
if (Form != null && Form.value != null) {
    if (Form.controls['user_seq'] != null &&
        Form.controls['user_seq'].value != null &&
        Form.controls['user_seq'].value > 0
    )
        pk = Form.controls['user_seq'].value;
}
 
//Create Request For Add and Update

let request: user = {
    user_name: control.value,
    user_seq: pk
}

            return userService.
            validate_name(request).
                pipe(
                    map(
                        (result: any) => {
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
        };
    }
