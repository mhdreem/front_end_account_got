import { user } from "./user";

export interface Privilages {
    user_seq ?:number ;
    formname?:string ;
    privilage?:string;
    user?:user;
}
