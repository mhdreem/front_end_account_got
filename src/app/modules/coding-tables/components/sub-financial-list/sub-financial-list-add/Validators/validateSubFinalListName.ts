import { FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { SubFinancialListService } from 'src/app/modules/shared/services/sub_financial_list.service';
import { sub_financial_list } from 'src/app/modules/shared/models/sub_financial_list';
export function validateSubFinalListName( SubFinancialListService:SubFinancialListService,                                    
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
            if (Form.controls['sub_financial_list_seq'] != null &&
                Form.controls['sub_financial_list_seq'].value != null &&
                Form.controls['sub_financial_list_seq'].value > 0
            )
                pk = Form.controls['sub_financial_list_seq'].value;
        }

        //Create Request For Add and Update

        let request: sub_financial_list = {
            sub_financial_list_name: control.value,
            sub_financial_list_seq: pk
        }
                    return SubFinancialListService.
                    validate_name(request).
                    pipe(
                        map(
                            (result: any) => {
                                console.log('result', result);
                                return (result && result.value) ? { "duplicate": true } : null;
                            }
                        ));
           
               
            }

            
    }
