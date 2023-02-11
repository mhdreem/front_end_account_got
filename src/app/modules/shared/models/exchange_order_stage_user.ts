import { exchange_order_stage } from "./exchange_order_stage";
import { user } from "./user"

export interface exchange_order_stage_user{

    ex_ord_stg_user_seq?: number;

    user_fk?: number;
    user?: user;

    ex_ord_stg_fk?: number;
    exchange_order_stage?: exchange_order_stage;
}