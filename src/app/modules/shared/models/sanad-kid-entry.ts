import { sanad_kid } from "./sanad-kid";
import { Sanad_kid_stage } from "./sanad_kid_stage";
import { user } from "./user";

export interface SanadKidEntry {
    seq?: number;


    sanad_kid_stg_fk?: number;
    sanad_kid_stage?: Sanad_kid_stage;

    exchange_order_fk?: number;
    sanad_kid?: sanad_kid;

    data?: string;

    user_entry_fk?: number;

    user_entry?: user;

    date_entry?: Date;
}
