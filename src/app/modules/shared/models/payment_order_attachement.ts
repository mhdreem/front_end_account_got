import { attachement_type } from "./attachement_type";
import { payment_order } from "./payment_order";

export interface payment_order_attachement
{
    payment_order_attachement_seq?: number,
    
    payment_order_fk?: number;
    payment_order?: payment_order;  


    payment_order_attachement_id?: number;
    payment_order_attachement_date?: Date;

    type_fk?: number;
    attachement_type?: attachement_type;

    payment_order_attachement_note?: string;

    payment_order_ownership ?:string ;
    payment_order_Source_number?:string ;
 
}
