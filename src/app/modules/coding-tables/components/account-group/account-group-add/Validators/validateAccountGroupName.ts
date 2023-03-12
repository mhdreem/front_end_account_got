import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountClassService } from 'src/app/modules/shared/services/account-class.service';
import { AccountFinalService } from 'src/app/modules/shared/services/account-final.service';
import { AccountGroupService } from 'src/app/modules/shared/services/account-group.service';
import { of } from 'rxjs';
import { account_group } from 'src/app/modules/shared/models/account_group';

export function validateAccountGroupName( accountGroupService:AccountGroupService,                                    
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
      if (Form.controls['account_group_seq'] != null &&
          Form.controls['account_group_seq'].value != null &&
          Form.controls['account_group_seq'].value > 0
      )
          pk = Form.controls['account_group_seq'].value;
  }

  //Create Request For Add and Update

  let request: account_group = {
      account_group_name: control.value,
      account_group_seq: pk
  }


            return accountGroupService.
            validate_name(request).
                pipe(
                    map(
                        (result: any) => {
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
        };
    }
