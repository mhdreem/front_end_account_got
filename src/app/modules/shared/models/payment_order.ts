import { branch } from "./branch";
import { payment_order_attachement } from "./payment_order_attachement";
import { payment_order_detail } from "./payment_order_detail";
import { payment_order_entry } from "./payment_order_entry";
import { sanad_kid } from "./sanad-kid";
import { sanad_kid_book } from "./sanad_kid_book";

export interface payment_order
{
    payment_order_seq?: number;

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
  
    name_of_owner?: string;
    branch_fk?: number;
    branch?: branch;
    payment_order_details?: payment_order_detail[];
    payment_order_attachements?: payment_order_attachement[];
    payment_order_entries?: payment_order_entry[]
}
