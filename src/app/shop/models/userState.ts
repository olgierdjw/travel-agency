import {Ranks} from "./ranks";

export interface UserState {
    user_id: string,
    username: String,
    banned: Boolean,
    rank: Ranks[]
}
