import { attachement_type } from "./attachement_type";
import { sanad_kid } from "./sanad-kid";

export interface sanad_kid_attachement
    {

        sanad_kid_attachement_seq?:number;


        sanad_kid_fk?:number;

        sanad_kid?: sanad_kid ;


         sanad_kid_attachement_id ?:number;



        sanad_kid_attachement_date?: Date ;



         type_fk?:number ;

        attachement_type?: attachement_type;



         sanad_kid_attachement_note?:string ;

    }