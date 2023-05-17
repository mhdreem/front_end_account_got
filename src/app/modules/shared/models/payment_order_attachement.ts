import { attachement_type } from "./attachement_type";
import { payment_order } from "./payment_order";

export interface payment_order_attachement
{
    attachement_seq?: number,
    
    payment_order_fk?: number;
    payment_order?: payment_order;  


    attachement_id?: number;
    attachement_date?: Date;

    type_fk?: number;
    attachement_type?: attachement_type;

    attachement_note?: string;

    ownership ?:string ;
    source_number?:string ;
 
}
