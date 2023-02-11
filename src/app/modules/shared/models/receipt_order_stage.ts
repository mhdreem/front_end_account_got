import { receipt_order_stage_user } from "./receipt_order_stage_user";

export interface receipt_order_stage
{
    rec_ord_stg_seq?: number;

    rec_ord_stg_name?: string;

    rec_ord_stg_order?: number;
    
    receipt_order_stage_users?: receipt_order_stage_user[];
}