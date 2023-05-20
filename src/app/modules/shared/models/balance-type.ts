import { accounts_tree } from "./accounts_tree";


export interface BalanceType {
    account_type_seq?: number,
    account_type_name?: string,
    account_type_order?: number,
    accounts_trees?: accounts_tree[]
}
