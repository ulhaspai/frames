import { User } from "./User";
import { Friendship } from "./Friendship";

/**
 * Model object for a user search result
 *
 * @author: Ulhas Pai
 */
export class UserSearchResult extends User {
    score: number
    friendship: Friendship
}
