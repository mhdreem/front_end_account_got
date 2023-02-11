import { exchange_order_stage_user } from "./exchange_order_stage_user";
import { user } from "./user"

export interface exchange_order_stage {
    ex_ord_stg_seq?: number;

    ex_ord_stg_name?: string;

    ex_ord_stg_order?: number;
    
    exchange_order_stage_users?: exchange_order_stage_user[];
}
