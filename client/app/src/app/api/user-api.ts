import { User } from "../models/user";
import { apiEndpoint } from "./api.endpoint";
import Axios from "axios";

/**
 * Auth Service for Auth0
 *
 * @author Ulhas Pai
 */
export class UserApi {

    public static async getCurrentUser(idToken: string): Promise<User> {
        console.log('Fetching current user')
        const response = await Axios.get(`${apiEndpoint}/current-user`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
        })
        console.log('Current user:', response.data)
        return response.data.item
    }

}
