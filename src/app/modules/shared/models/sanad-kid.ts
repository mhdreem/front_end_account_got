import { branch } from "./branch";
import { operation_type } from "./operation_type";
import { sanad_kid_entry } from "./sanad-kid-entry";
import { sanad_kid_attachement } from "./sanad_kid_attachement";
import { sanad_kid_book } from "./sanad_kid_book";
import { sanad_kid_detail } from "./sanad_kid_detail";
import { user } from "./user";


export interface sanad_kid {

    sanad_kid_seq?: number;
    document_id?: number;
    document_date?: Date;
    incumbent_id?: number;
    incumbent_date?: Date;

    operation_type_fk?: number;
    operation_type?: operation_type;

    operation_code_fk?: number;

    month_incumbent?: number;
    year_incumbent?: number;
    month_document?: number;
    year_document?: number;
    Book_fk?: number;



    total_value?: number;

    sanad_close?: number;

    
    sanad_opening?: number;


    user_creator_fk?: number;
    user_creator?: user;


    date_time_create?: Date;

    user_modify_fk?: number;
    user_modify?: user;

    date_time_modify?: Date;



    name_of_owner?: string;

    branch_fk?: number;

    branch?: branch;

    sanad_kid_details?: sanad_kid_detail[];
    sanad_kid_attachements?: sanad_kid_attachement[];
    sanad_kid_entries?: sanad_kid_entry[]

    book_fk?: number;
    sanad_kid_book?: sanad_kid_book;

    sanad_kid_type_fk?: number;



}
