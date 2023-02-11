import { attachement_type } from "./attachement_type";
import { exchange_order } from "./exchange_order";

export interface exchange_order_attachement {
    exchange_order_attachement_seq?: number,

    exchange_order_fk?: number;
    exchange_order?: exchange_order;  


    exchange_order_attachement_id?: number;
    exchange_order_attachement_date?: Date;

    type_fk?: number;
    attachement_type?: attachement_type;

    exchange_order_attachement_note?: string;
}
