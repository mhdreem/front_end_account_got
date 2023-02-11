import { exchange_order } from "./exchange_order"
import { exchange_order_stage } from "./exchange_order_stage"
import { user } from "./user"

export interface exchange_order_entry {
    seq?: number;


    ex_ord_stg_fk?: number;
    exchange_order_stage?: exchange_order_stage;

    exchange_order_fk?: number;
    exchange_order?: exchange_order;

    data?: string;

    user_entry_fk?: number;

    user_entry?: user;

    date_entry?: Date;
    
}
