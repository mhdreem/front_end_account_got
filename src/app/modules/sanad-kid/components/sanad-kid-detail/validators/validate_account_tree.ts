import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { PageSanadKidService } from "../../../pageservice/page-sanad-kid.service";

export function validate_account_tree(PageSanadKidService:PageSanadKidService,
                                        id:number|null,): AsyncValidatorFn{
    return (control: AbstractControl)
    : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

        let value_From_Control: string = control.value;
            if (!value_From_Control ||
                value_From_Control.length == 0
            )
            return of(null);

            let result: any= of(null);
            PageSanadKidService.sanad_kid.sanad_kid_details?.forEach(detail=>{
                if (detail.accounts_tree_fk == id){
                    result= of({ "accountTreeExists": true })
                }
            });
            return result;
    }
                                
}