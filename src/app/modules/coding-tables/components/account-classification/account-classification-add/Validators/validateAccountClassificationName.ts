import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountClassService } from 'src/app/modules/shared/services/account-class.service';
import { of } from 'rxjs';
import { account_class } from 'src/app/modules/shared/models/account_class';
import { AccountclassificationService } from 'src/app/modules/shared/services/account-classification.service';
import { AccountClassification } from 'src/app/modules/shared/models/account-classification';

export function validateAccountClassName( accountclassificationService:AccountclassificationService,                                    
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
            if (Form.controls['AccountClassification_seq'] != null &&
                Form.controls['AccountClassification_seq'].value != null &&
                Form.controls['AccountClassification_seq'].value > 0
            )
                pk = Form.controls['AccountClassification_seq'].value;
        }

        //Create Request For Add and Update

        let request: AccountClassification = {
            classification_name: control.value,
            classification_seq: pk
        }

            return accountclassificationService.
            validate_name(request).
                pipe(
                    map(
                        (result: any) => {
                            console.log('222', result);
                            return (result && result.value) ? { "duplicate": true } : null;
                        }
                    ));
        };
    }
