import { account_center } from "./account-center";
import { accounts_tree } from "./account-tree";

export interface ExchangeOrderDetails {
    seq?: number,
    exchange_order_fk?: number,
    exchange_order?: string,
    debtor?: number,
    creditor?: number,
    accounts_tree_fk?: number,
    accounts_tree?: accounts_tree,
    account_center_fk?: number,
    account_center?: account_center,
    account_notice?: string
}

