import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";

export function validate_account_tree(details:any[] | undefined
                                        ): AsyncValidatorFn{
    return (control: AbstractControl)
    : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

        if (details == null ||
            details.length ==0)
            return of(null);

        let value_From_Control: string = control.value;
            if (!value_From_Control ||
                value_From_Control.length == 0
            )
            return of(null);

            let result: any= of(null);
            
            details?.forEach(detail=>{
                if (detail.accounts_tree_fk == value_From_Control){
                    result= of({ "accountTreeExists": true })
                }
            });
            return result;
    }
                                
}