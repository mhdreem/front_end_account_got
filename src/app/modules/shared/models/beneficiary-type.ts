import { accounts_tree } from "./accounts_tree";
import {account_classification} from './account-classification'
export interface beneficiary_type {
    beneficiary_type_seq?: number,
    beneficiary_type_name?: string,
    beneficiary_type_code?: string,
    beneficiary_type_note?: string,
    classification_fk?: number,
    account_classification?: account_classification,
    accounts_tree_fk?: number,
    accounts_tree?: accounts_tree,

}
