import { User } from "./user";

export class UserSearchResult extends User {
    score: number
    friendStatus: {
        requested: boolean
        accepted: boolean
    }
}
