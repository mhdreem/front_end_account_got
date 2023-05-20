import { accounts_tree } from "./accounts_tree"
import { beneficiary_type } from "./beneficiary-type"

export interface account_classification {
    classification_seq?: number,
    classification_name?: string,
    accounts_trees?: accounts_tree[]
    beneficiary_types?: beneficiary_type[]
}
