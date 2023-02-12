import { account_center } from "./account-center"
import { account_class } from "./account-class"
import { account_final } from "./account-final"
import { account_group } from "./account-group"
import { account_level } from "./account-level"
import { accounts_tree } from "./account-tree"
import { BalanceType } from "./balance-type"
import { branch } from "./branch"
import { ExchangeOrderAttachements } from "./exchange-order-attachements"
import { ExchangeOrderDetails } from "./exchange-order-details"
import { ExchangeOrderEntry } from "./exchange-order-entry"
import { finance_list } from "./finance-list"
import { sanad_kid } from "./sanad-kid"

export interface ExchangeOrder {
    exchange_order_seq?: number,
    sanad_kid_fk?: number,
    sanad_kid?: sanad_kid,
    document_id?: number,
    document_date?: Date,
    incumbent_id?: number,
    incumbent_date?: Date,
    month_incumbent?: number,
    year_incumbent?: number,
    month_sanad?: number,
    year_sanad?: number,
    exchange_order_type_fk?: number,
    book_fk?: number,
    total_value?: number,
    attach?: string,
    name_of_owner?: string,
    branch_fk?: number,
    branch?: branch,
    exchange_order_details?: ExchangeOrderDetails[],
    exchange_order_attachements?: ExchangeOrderAttachements[],
    exchange_order_entries?: ExchangeOrderEntry[]
}
