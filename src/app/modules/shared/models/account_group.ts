import { accounts_tree } from "./accounts_tree";

export interface account_group {
    account_group_seq ?: number;
  account_group_name ?: string;
  account_group_order?: number;
  accounts_trees?: accounts_tree[];
}
