import { User } from "./User";

/**
 * Model object for a user search result
 *
 * @author: Ulhas Pai
 */
export class UserSearchResult extends User {
    score: number
    friendStatus: {
        requested: boolean
        accepted: boolean
    }
}
