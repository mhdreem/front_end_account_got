import { user } from "./user"

export interface ExchangeOrderStage {
    ex_ord_stg_seq?: number,
    ex_ord_stg_name?: string,
    ex_ord_stg_order?: number,
    exchange_order_stage_users?: {
        ex_ord_stg_user_seq?: number,
        user_fk?: number,
        user?: user
        ex_ord_stg_fk?: number,
        exchange_order_stage?: string
    }[],
}
