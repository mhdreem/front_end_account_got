import { account_center } from "./account_center";
import { accounts_tree } from "./accounts_tree";
import { branch } from "./branch";
import { sanad_kid } from "./sanad-kid";

export interface sanad_kid_detail {
    seq?: number;
    sanad_kid_fk?: number;
    sanad_kid?: sanad_kid ;
    debtor?: number  | null;
    creditor?: number | null;
    accounts_tree_fk?: number;
    accounts_tree?: accounts_tree;
    account_center_fk?: number| null;
    account_center?: account_center;
    account_notice?: string | null;
    branch_fk?: number;
    branch?: branch;
}