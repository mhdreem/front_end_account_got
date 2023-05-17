import { attachement_type } from "./attachement_type";
import { sanad_kid } from "./sanad-kid";

export interface sanad_kid_attachement {

    attachement_seq?: number;
    sanad_kid_fk?: number;
    sanad_kid?: sanad_kid;
    attachement_id?: number;
    attachement_date?: Date;

    type_fk?: number;

    attachement_type?: attachement_type;

    ownership?: string;
    source_number?: string;

    attachement_note?: string;

}