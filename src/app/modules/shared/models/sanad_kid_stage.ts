import { Sanad_kid_stage_user } from "./sanad_kid_stage_user";

export interface Sanad_kid_stage {
    snd_kid_stg_seq?: number;

    snd_kid_stg_name?: string;

    snd_kid_stg_order?: number;
    
    sanad_kid_stage_users?: Sanad_kid_stage_user[];
}
