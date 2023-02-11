import { receipt_order } from "./receipt_order";
import { receipt_order_stage } from "./receipt_order_stage";
import { user } from "./user";

export interface receipt_order_entry
{
    seq?: number;


    rec_ord_stg_fk?: number;
    receipt_order_stage?: receipt_order_stage;

    receipt_order_fk?: number;
    receipt_order?: receipt_order;

    data?: string;

    user_entry_fk?: number;

    user_entry?: user;

    date_entry?: Date;
    
}
