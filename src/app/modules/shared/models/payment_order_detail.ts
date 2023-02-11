import { accounts_tree } from "./accounts_tree";
import { account_center } from "./account_center";
import { payment_order } from "./payment_order";

export interface payment_order_detail
{
    seq?: number;
    payment_order_fk?: number;

    payment_order?: payment_order;
    
    debtor?: number;

    creditor?: number;

    accounts_tree_fk?: number;

    accounts_tree?: accounts_tree;

    account_center_fk?: number;

    account_center?: account_center;

    account_notice?: string;
}

