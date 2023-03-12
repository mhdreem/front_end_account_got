import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { DepartmentService } from 'src/app/modules/shared/services/department.service';
import { of } from 'rxjs';
import { ExchangeOrderStageService } from 'src/app/modules/shared/services/exchange-order-stage.service';
import { SanadKidStageService } from 'src/app/modules/shared/services/sanad-kid-stage.service';
import { Sanad_kid_stage_user } from 'src/app/modules/shared/models/sanad_kid_stage_user';
import { Sanad_kid_stage } from 'src/app/modules/shared/models/sanad_kid_stage';

export function validateSndKidStgName( sanadKidStageService:SanadKidStageService,                                    
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
    if (Form.controls['snd_kid_stg_seq'] != null &&
        Form.controls['snd_kid_stg_seq'].value != null &&
        Form.controls['snd_kid_stg_seq'].value > 0
    )
        pk = Form.controls['snd_kid_stg_seq'].value;
}
 
//Create Request For Add and Update

let request: Sanad_kid_stage = {
    snd_kid_stg_name: control.value,
    snd_kid_stg_seq: pk
}

            return sanadKidStageService.
            validate_name(request).
                pipe(
                    map(
                        (result: any) => {
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
        };
    }
