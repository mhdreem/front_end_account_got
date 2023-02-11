import { account_center } from "./account_center";
import { accounts_tree } from "./accounts_tree";
import { exchange_order } from "./exchange_order";
import { branch } from "./branch";

export interface exchange_order_detail {
    seq?: number;
    exchange_order_fk?: number;

    exchange_order?: exchange_order;
    
    debtor?: number;

    creditor?: number;

    accounts_tree_fk?: number;

    accounts_tree?: accounts_tree;

    account_center_fk?: number;

    account_center?: account_center;

    account_notice?: string;


    branch_fk?: number;
    branch?: branch;
    
}

