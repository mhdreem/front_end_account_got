import { payment_order_stage } from "./payment_order_stage";
import { user } from "./user";

export interface payment_order_stage_user
{
    pay_ord_stg_user_seq?: number;

    user_fk?: number;
    user?: user;

    pay_ord_stg_fk?: number;
    payment_order_stage?: payment_order_stage;
}