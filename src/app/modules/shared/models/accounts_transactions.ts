import { accounts_tree } from "./accounts_tree";
import { account_center } from "./account_center";
import { branch } from "./branch";
import { sanad_kid_book } from "./sanad_kid_book";

export interface accounts_transactions {
   
        seq ?:number;

        operation_fk?:number;
        operation_date?:number;
         operation_type?:string;

        document_id?:number;
        document_date?:Date;

        incumbent_id ?:number;
        incumbent_date?:Date;

        month_incumbent?:number;
        year_incumbent?:number;

        month_document?:number;
         year_document?:number;

         name_of_owner?:string;

        branch_fk?:number;
        branch?: branch;

         Book_fk?:number;

        sanad_kid_book?: sanad_kid_book;
        total_value ?:number;

        debtor ?:number;
        creditor ?:number;

        accounts_tree_fk ?:number;
        accounts_tree ?: accounts_tree;

        account_center_fk?:number;
        account_center?: account_center;



         account_notice?:string;
}