import { account_center } from "./account_center";
import { account_class } from "./account_class";
import { account_final } from "./account_final";
import { account_group } from "./account_group";
import { account_level } from "./account_level";
import { account_type } from "./account_type";
import { branch } from "./branch";
import { finance_list } from "./finance_list";


export interface accounts_tree {

    seq?: number;
    
    branch_fk?: number;
    branch?: branch;

    account_id?: string;

    account_name?: string;


   



    account_class_fk?: number;
    account_class?: account_class;

    account_group_fk?: number;
    account_group?: account_group;

    account_level_fk?: number;
    account_level?: account_level;

    finance_list_fk?: number;
    finance_list?: finance_list;

    account_final_fk?: number;
    account_final?: account_final;

    balance_debtor?: number;
    balance_creditor?: number;

    balance_type_fk?: number;
    balance_type?: account_type;

    account_center_fk?: number;
    account_center?: account_center;

    address?: string;
    phone?: string;
    mobil?: string;
    fax?: string;
    notice?: string;
    name_creator?: string;
    date_time_create?: Date;
    name_modify?: string;
    date_time_modify?: Date;

    account_parent_seq?: number;

    account_parent?: accounts_tree;

    children?: accounts_tree[]
}
