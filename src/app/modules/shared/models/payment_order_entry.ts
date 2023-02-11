import { payment_order } from "./payment_order";
import { payment_order_stage } from "./payment_order_stage";
import { user } from "./user";

export interface payment_order_entry
{
    seq?: number;


    pay_ord_stg_fk?: number;
    payment_order_stage?: payment_order_stage;

    payment_order_fk?: number;
    payment_order?: payment_order;

    data?: string;

    user_entry_fk?: number;

    user_entry?: user;

    date_entry?: Date;
    
}
