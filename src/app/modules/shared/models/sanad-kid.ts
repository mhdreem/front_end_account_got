import { account_center } from "./account-center";
import { accounts_tree } from "./account-tree";
import { branch } from "./branch";
import { sanad_kid_detail } from "./sanad_kid_detail";
import { user } from "./user";


export interface sanad_kid {
    sanad_kid_seq?: number;
    sanad_kid_id?: number;
    sanad_kid_date?: Date;
    incumbent_id?: number;
    incumbent_date?: Date;
    sanad_total_value?: number;
    sanad_close?: number;
    user_creator_fk?: number;
    user_creator?: user;
    date_time_create?: Date;
    user_modify_fk?: number;
    user_modify?: user;
    date_time_modify?: Date;
    attach1?: string;
    attach2?: string;
    attach3?: string;
    attach4?: string;
    attach5?: string;
    name_of_owner?: string;
    branch_fk?: number;
    branch?: branch;
    sanad_kid_details?:sanad_kid_detail[];    
}
