import { account_center } from "./account_center";

export interface sub_financial_list {

    sub_financial_list_seq?: number;

    sub_financial_list_name?: string;

    direct_cost_center_fk?: number;
    direct_account_center?: account_center;




    indirect_cost_center_fk?: number;

    indirect_account_center?: account_center;


}