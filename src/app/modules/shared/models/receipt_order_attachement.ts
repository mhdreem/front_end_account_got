import { attachement_type } from "./attachement_type";
import { receipt_order } from "./receipt_order";

export interface  receipt_order_attachement
{
    attachement_seq?: number,
    
    receipt_order_fk?: number;
    receipt_order?: receipt_order;  


    attachement_id?: number;
    attachement_date?: Date;

    type_fk?: number;
    attachement_type?: attachement_type;

    attachement_note?: string;

    
   ownership ?:string ;
   source_number?:string ;

}
