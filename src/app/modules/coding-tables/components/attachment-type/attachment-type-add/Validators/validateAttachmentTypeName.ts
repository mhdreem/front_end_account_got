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
