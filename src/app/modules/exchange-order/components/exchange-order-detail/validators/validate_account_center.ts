import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { PageExchangeOrderService } from "../../../pageservice/page-exchange-order.service";
import { exchange_order } from "src/app/modules/shared/models/exchange_order";
import { exchange_order_detail } from "src/app/modules/shared/models/exchange_order_detail";
import { accounts_tree } from "src/app/modules/shared/models/accounts_tree";
import { AccountTreeService } from "src/app/modules/shared/services/account-tree.service";

export function validate_account_center(form_exchange_order_details:any[] | undefined,
    AccountTreeService:AccountTreeService

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

            let Parent_FormGroup : FormGroup = control.parent as FormGroup;
            if (Parent_FormGroup== null )
            return of(null);
            if (Parent_FormGroup.controls['accounts_tree_fk']== null )
            return of(null);
            if (Parent_FormGroup.controls['accounts_tree_fk'].value== null )
            return of(null);

            let result: any= of(null);



            if (AccountTreeService.List_AccountsTree!= null )
            {
                var arrs =AccountTreeService.List_AccountsTree .filter(x=>x.seq == Parent_FormGroup.controls['accounts_tree_fk'].value);
                if (arrs!= null && arrs.length>0)
                {
                  
                  if (arrs[0].account_id!= null &&
                    arrs[0].account_id.charAt(0)=='3' )
                    {
                        result= of({ "required": true })
                    }
                }
    
               
                
    
            }

            
            return result;
    }
                                
}