import { branch } from "./branch";
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

    sanad_total_value?: number;

    sanad_close?: number;

    user_creator_fk?: number;
    user_creator?:user;


    date_time_create?: Date;

    user_modify_fk?: number;
    user_modify?: user;

    date_time_modify?: Date;


    name_of_owner?: string;

    branch_fk?: number;

    branch?: branch;

    sanad_kid_details?:sanad_kid_detail[];    
    sanad_kid_attachements?:sanad_kid_attachement[];

    book_fk?: number;
    sanad_kid_book?:sanad_kid_book;

    sanad_kid_type_fk?: number;
}
