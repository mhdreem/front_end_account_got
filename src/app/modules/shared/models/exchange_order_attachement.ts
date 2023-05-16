import { attachement_type } from "./attachement_type";
import { exchange_order } from "./exchange_order";

export interface exchange_order_attachement {
    attachement_seq?: number,

    exchange_order_fk?: number;
    exchange_order?: exchange_order;  

    ownership?:string;
    source_number?:string;


    attachement_id?: number;
    attachement_date?: Date;

    type_fk?: number;
    attachement_type?: attachement_type;

    attachement_note?: string;
}
