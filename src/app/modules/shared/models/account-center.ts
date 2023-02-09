import { accounts_tree } from "./account-tree";

export interface account_center {
    account_center_seq?: number;
    account_center_id?: number;
    account_center_name?: string;
    account_center_final_seq?: number;
    account_center_order?: number;
    accounts_trees?: accounts_tree[];
}
