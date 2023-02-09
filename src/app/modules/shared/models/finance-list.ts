import { accounts_tree } from "./account-tree";

export interface finance_list {
  finance_list_seq?: number;
  finance_list_name?: string;
  finance_list_order?: number;
  accounts_trees?: accounts_tree[];
}
