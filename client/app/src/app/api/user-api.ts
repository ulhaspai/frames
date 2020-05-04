import { User } from "../models/user";
import { apiEndpoint } from "./api.endpoint";
import Axios from "axios";
import { UserSearchResult } from "../models/user-search-result";

/**
 * User service for performing actions on user data
 *
 * @author Ulhas Pai
 */
export class UserApi {

    /**
     * called on user login. gets the current logged in user info
     *
     * @param idToken authorization token
     */
    public static async getCurrentUser(idToken: string): Promise<User> {
        console.log('Fetching current user')
        const response = await Axios.get(`${apiEndpoint}/current-user`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
        })
        console.log('Current user: ', response.data)
        return response.data.item
    }

    /**
     * searches users within the system. return the top 10 search results
     *
     * @param idToken authorization token
     * @param query the query string to search
     */
    public static async searchUsers(idToken: string, query: string): Promise<UserSearchResult> {
        console.log('Querying users for query : ', query)
        const response = await Axios.get(`${apiEndpoint}/search-user`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            params: {
                query
            }
        })
        console.log('Query user result: ', response.data)
        return response.data.items
    }

}
