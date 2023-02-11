import { accounts_tree } from "./accounts_tree";
import { account_center } from "./account_center";
import { receipt_order } from "./receipt_order";

export interface receipt_order_detail
{
    seq?: number;
    receipt_order_fk?: number;

    receipt_order?: receipt_order;
    
    debtor?: number;

    creditor?: number;

    accounts_tree_fk?: number;

    accounts_tree?: accounts_tree;

    account_center_fk?: number;

    account_center?: account_center;

    account_notice?: string;
}