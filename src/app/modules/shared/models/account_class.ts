import { accounts_tree } from "./accounts_tree";

export interface account_class {
    account_class_seq?: number;
  account_class_name?: string;
  account_class_order?: number;
  accounts_trees?: accounts_tree[];
}
