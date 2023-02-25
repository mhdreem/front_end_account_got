import { Sanad_kid_stage } from "./sanad_kid_stage";
import { user } from "./user";

export interface Sanad_kid_stage_user {
    snd_kid_stg_user_seq?: number;

    user_fk?: number;
    user?: user;

    snd_kid_stg_fk?: number;
    sanad_kid_stage?: Sanad_kid_stage;
}
