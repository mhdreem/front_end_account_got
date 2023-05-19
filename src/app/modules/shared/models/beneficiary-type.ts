import { accounts_tree } from "./accounts_tree";
import {AccountClassification} from './account-classification'
export interface BeneficiaryType {
    beneficiary_type_seq?: number,
    beneficiary_type_name?: string,
    beneficiary_type_code?: string,
    beneficiary_type_note?: string,
    classification_fk?: number,
    account_classification?: AccountClassification,
    accounts_tree_fk?: number,
    accounts_tree?: accounts_tree,

}
