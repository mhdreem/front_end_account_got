import { accounts_tree } from "./accounts_tree";

export interface account_level {
    account_level_seq?: number;
  account_level_name?: string;
  account_level_order?: number;
  accounts_trees?: accounts_tree[];
}
