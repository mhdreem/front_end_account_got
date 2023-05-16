

import { accounts_tree } from "./accounts_tree"
export interface payment_safe
{
    
     payment_safe_seq ?:number;


     payment_safe_name  ?:string;

     payment_safe_order  ?:number;

     accounts_tree_fk  ?:number;

     accounts_tree ?: accounts_tree; 
}