import { attachement_type } from "./attachement_type";
import { receipt_order } from "./receipt_order";

export interface  receipt_order_attachement
{
    receipt_order_attachement_seq?: number,
    
    receipt_order_fk?: number;
    receipt_order?: receipt_order;  


    receipt_order_attachement_id?: number;
    receipt_order_attachement_date?: Date;

    type_fk?: number;
    attachement_type?: attachement_type;

    receipt_order_attachement_note?: string;
}
