import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { of } from 'rxjs';
import { branch } from 'src/app/modules/shared/models/branch';

export function validateBranchName( branchService:BranchService,                                    
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
    if (Form.controls['branch_seq'] != null &&
        Form.controls['branch_seq'].value != null &&
        Form.controls['branch_seq'].value > 0
    )
        pk = Form.controls['branch_seq'].value;
}

//Create Request For Add and Update

let request: branch = {
    branch_name: control.value,
    branch_seq: pk
}
            
              
            return branchService.
            validate_name(request).
                pipe(
                    map(
                        (result: any) => {
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
          
        };
    }
