import { branch } from "./branch";
import { department } from "./department";


export interface user {
    user_seq?: number,
    user_first_name?: string,
    user_last_name?: string,
    department_fk?: number,
    department?: department,
    branch_fk?: number,
    branch?: branch,
    user_name?: string,
    user_password?: string
}
