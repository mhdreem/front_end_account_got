import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { PageExchangeOrderService } from "../../../pageservice/page-exchange-order.service";
import { exchange_order } from "src/app/modules/shared/models/exchange_order";
import { exchange_order_detail } from "src/app/modules/shared/models/exchange_order_detail";

export function validate_account_tree(form_exchange_order_details:any[] | undefined
                                        ): AsyncValidatorFn{
    return (control: AbstractControl)
    : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

        if (form_exchange_order_details == null ||
            form_exchange_order_details.length ==0)
            return of(null);

        let value_From_Control: string = control.value;
            if (!value_From_Control ||
                value_From_Control.length == 0
            )
            return of(null);

            let result: any= of(null);
            
            form_exchange_order_details?.forEach(detail=>{
                if (detail.accounts_tree_fk == value_From_Control){
                    result= of({ "accountTreeExists": true })
                }
            });
            return result;
    }
                                
}