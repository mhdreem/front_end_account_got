import { account_center } from "./account-center";
import { accounts_tree } from "./account-tree";
import { sanad_kid } from "./sanad-kid";

export interface sanad_kid_detail {
    seq?: number;
    sanad_Kid_fk?: number;
    sanad_kid?: sanad_kid ;
    debtor?: number  | null;
    creditor?: number | null;
    accounts_tree_fk?: number;
    accounts_tree?: accounts_tree;
    account_center_fk?: number;
    account_center?: account_center;
    account_notice?: string | null;
}