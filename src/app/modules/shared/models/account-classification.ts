import { accounts_tree } from "./accounts_tree"
import { BeneficiaryType } from "./beneficiary-type"

export interface AccountClassification {
    classification_seq?: number,
    classification_name?: string,
    accounts_trees?: accounts_tree[]
    beneficiary_types?: BeneficiaryType[]
}
