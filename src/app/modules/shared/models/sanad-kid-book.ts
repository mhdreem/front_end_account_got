import { accounts_tree } from "./account-tree"
import { branch} from "./branch"

export interface SanadKidBook {
    sanad_kid_book_seq?: number,
    sanad_kid_book_name?: string,
    cash_account_fk?: number,
    cash_accounts_tree?: accounts_tree,
    incumbent_id_generate_type_fk?: number,
    sanad_kid_book_order?: number,
    sanad_kid_book_default?: number,
    branch_fk?: number,
    branch?: branch
}
