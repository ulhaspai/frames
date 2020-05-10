import { User } from "../models/user";
import { apiEndpoint } from "./api.endpoint";
import Axios from "axios";
import { UserSearchResult } from "../models/user-search-result";
import { Friend } from "../models/friend";
import { AttachmentMessage, Message, SendFileResponse, TextMessage } from "../message-stream/message-stream.models";

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
    public static async searchUsers(idToken: string, query: string): Promise<UserSearchResult[]> {
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

    /**
     * searches users within the system. return the top 10 search results
     *
     * @param idToken authorization token
     * @param friendId the user to be added as friend
     */
    public static async addFriend(idToken: string, friendId: string): Promise<boolean> {
        console.log('Adding friend : ', friendId)
        const encodedFriend = encodeURIComponent(friendId)
        const response = await Axios.post(`${apiEndpoint}/friends/${encodedFriend}`, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        })
        return response.status === 201
    }

    /**
     * gets all the friends for the current logged in user
     *
     * @param idToken authorization token
     */
    public static async getFriends(idToken: string): Promise<Friend[]> {
        console.log('Getting friends : ')
        const response = await Axios.get(`${apiEndpoint}/friends`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        })
        return response.data.items
    }

    /**
     * fetches the conversation with a friend
     *
     * @param idToken authorization token
     * @param friendId the friend id
     * @param from starting value of time range (inclusive, gte)
     * @param to ending value of time range (exclusive, lt)
     */
    public static async getMessages(idToken: string, friendId: string, from: Date, to: Date): Promise<Message<any>[]> {
        console.log(`fetching messages with ${friendId}`);
        const encodedFriendId = encodeURIComponent(friendId)
        const response = await Axios.get(`${apiEndpoint}/friends/${encodedFriendId}/${from.toISOString()}/${to.toISOString()}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        })
        return response.data.items
    }

    /**
     * sends a text message to a friend
     *
     * @param idToken authorization token
     * @param message the message to be sent
     */
    public static async sendTextMessage(idToken: string, message: TextMessage): Promise<Message<string>> {
        console.log('sending message : ', message)
        const response = await Axios.post(`${apiEndpoint}/send-message`, message, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        })
        return response.data.message
    }

    /**
     * sends an attachment message to a friend
     *
     * @param idToken authorization token
     * @param message the message to be sent
     */
    public static async sendAttachmentMessage(idToken: string, message: AttachmentMessage): Promise<SendFileResponse> {
        console.log('sending message : ', message)
        const response = await Axios.post(`${apiEndpoint}/send-file`, message, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        })
        return response.data
    }

    public static async uploadFile(uploadUrl: string, file: File): Promise<void> {
        console.log('uploading file : ', file)
        await Axios.put(uploadUrl, await file.arrayBuffer())
    }

}
