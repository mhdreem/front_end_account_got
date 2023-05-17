import { accounts_tree } from "./accounts_tree";

export interface account_center {
    account_center_seq?: number;
    account_center_id?: string;
    account_center_name?: string;
    account_center_final_seq?: number;
    account_center_order?: number;
    account_center_parent_fk?:number;
    children?:account_center[];
    account_center_parent?:account_center;
    accounts_trees?: accounts_tree[];
}
