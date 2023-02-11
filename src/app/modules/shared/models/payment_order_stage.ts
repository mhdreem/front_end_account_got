import { payment_order_stage_user } from "./payment_order_stage_user";

export interface payment_order_stage
{
    pay_ord_stg_seq?: number;

    pay_ord_stg_name?: string;

    pay_ord_stg_order?: number;
    
    payment_order_stage_users?: payment_order_stage_user[];
}