import { branch } from "./branch"
import { exchange_order_attachement } from "./exchange_order_attachement"
import { exchange_order_detail } from "./exchange_order_detail"
import { exchange_order_entry } from "./exchange_order_entry"
import { sanad_kid } from "./sanad-kid"
import { sanad_kid_book } from "./sanad_kid_book"

export interface exchange_order {

    exchange_order_seq?: number;

    sanad_kid_fk?: number;
    sanad_kid?: sanad_kid;

    document_id?: number;

    document_date?: Date;

    incumbent_id?: number;
    incumbent_date?: Date;

    month_incumbent?: number;
    year_incumbent?: number;

    month_document?: number;
    year_document?: number;

    exchange_order_type_fk?: number;

    book_fk?: number;
    sanad_kid_book?:sanad_kid_book;
    
    total_value?: number;
    attach?: string;
    name_of_owner?: string;
    branch_fk?: number;
    branch?: branch;
    exchange_order_details?: exchange_order_detail[];
    exchange_order_attachements?: exchange_order_attachement[];
    exchange_order_entries?: exchange_order_entry[]
}
