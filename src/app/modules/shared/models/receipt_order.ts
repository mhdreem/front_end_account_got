import { branch } from "./branch";
import { receipt_order_attachement } from "./receipt_order_attachement";
import { receipt_order_detail } from "./receipt_order_detail";
import { receipt_order_entry } from "./receipt_order_entry";
import { sanad_kid } from "./sanad-kid";
import { sanad_kid_book } from "./sanad_kid_book";

export interface receipt_order
{
    receipt_order_seq?: number;

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
    receipt_order_details?: receipt_order_detail[];
    receipt_order_attachements?: receipt_order_attachement[];
    receipt_order_entries?: receipt_order_entry[]
}
