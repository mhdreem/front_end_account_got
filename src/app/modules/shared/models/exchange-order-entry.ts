import { ExchangeOrder } from "./exchange-order"
import { ExchangeOrderStage } from "./exchange-order-stage"
import { user } from "./user"

export interface ExchangeOrderEntry {
    seq?: number,
    ex_ord_stg_fk?: number,
    exchange_order_stage?: ExchangeOrderStage,
    exchange_order_fk?: number,
    exchange_order?: ExchangeOrder,
    data?: string,
    user_entry_fk?: number,
    user_entry?: user
    date_entry?: Date
}
