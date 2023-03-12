import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountClassService } from 'src/app/modules/shared/services/account-class.service';
import { AccountFinalService } from 'src/app/modules/shared/services/account-final.service';
import { AccountGroupService } from 'src/app/modules/shared/services/account-group.service';
import { AccountLevelService } from 'src/app/modules/shared/services/account-level.service';
import { account_typeService } from 'src/app/modules/shared/services/account-type.service';
import { of } from 'rxjs';
import { AttachmentTypeService } from 'src/app/modules/shared/services/attachment-type.service';
import { attachement_type } from 'src/app/modules/shared/models/attachement_type';

export function validateAttachmentTypeName( attachmentTypeService:AttachmentTypeService,                                    
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
    if (Form.controls['attachement_type_seq'] != null &&
        Form.controls['attachement_type_seq'].value != null &&
        Form.controls['attachement_type_seq'].value > 0
    )
        pk = Form.controls['attachement_type_seq'].value;
}
 
//Create Request For Add and Update

let request: attachement_type = {
    attachement_type_name: control.value,
    attachement_type_seq: pk
}
            return attachmentTypeService.
            validate_name({
                "attachement_type_name": value_From_Control}).
                pipe(
                    map(
                        (result: any) => {
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
        };
    }
