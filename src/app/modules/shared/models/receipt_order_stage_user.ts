import { payment_order_stage } from "./payment_order_stage";
import { user } from "./user";

export interface receipt_order_stage_user
{
    rec_ord_stg_user_seq?: number;

    user_fk?: number;
    user?: user;

    rec_ord_stg_fk?: number;
    receipt_order_stage?: payment_order_stage;
}