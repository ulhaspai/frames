import { User } from "./user";
import { Friendship } from "./friendship";

export class UserSearchResult extends User {
    score: number
    friendship: Friendship
}
