import { createLogger } from "../utils/logger";
import { IFramesDataAccess } from "../data-layer/IFramesDataAccess";
import { FramesDocumentClient } from "../data-layer/FramesDocumentClient";
import { User } from "../models/User";
import { ElasticsearchQueryHit } from "../models/ElasticsearchQueryHit";
import { IStreamDataAccess } from "../data-layer/IStreamDataAccess";
import { ElasticsearchStreamClient } from "../data-layer/ElasticsearchStreamClient";
import { UserSearchResult } from "../models/UserSearchResult";
import { FriendManager } from "./FriendManager";
import { Friendship } from "../models/Friendship";
import { Friend } from "../models/Friend";

const userDataAccess: IFramesDataAccess = new FramesDocumentClient()
const elasticDataAccess: IStreamDataAccess = new ElasticsearchStreamClient()

const logger = createLogger('UserManager')

/**
 * User manager provides all the business logic related to a the user for the frames application
 *
 * @author: Ulhas Pai
 */
export class UserManager {

    /**
     * @param user the user to be created
     */
    static async createUser(user: User) : Promise<User> {
        logger.info("creating a new user = " + JSON.stringify(user))
        return userDataAccess.createUser(user)
    }

    /**
     * @param userId the user id of the user
     * @return the user for the input user id if exists, otherwise null
     */
    static async getUser(userId: string): Promise<User> {
        logger.info("get user for user id"  + JSON.stringify(userId))
        return userDataAccess.getUser(userId)
    }

    /**
     * checks whether elastic search is up and running
     */
    static async isElasticsearchUp(): Promise<any> {
        return elasticDataAccess.ping()
    }

    /**
     * indexes the provided user for the user id to elastic search stream
     *
     * @param user the user to be indexed
     */
    static async index(user: User): Promise<any> {
        return elasticDataAccess.index(user)
    }

    /**
     * searches elasticsearch for the input query
     *
     * @param query the query to be searched
     * @param userId the current user id
     * @return the top 10 search results for all the matches found
     */
    static async searchUsers(query: string, userId: string): Promise<Array<UserSearchResult>> {
        logger.info("searching elasticsearch query = "  + JSON.stringify(query))
        const hits: Array<ElasticsearchQueryHit<User>> = await elasticDataAccess.search(query)
        let results = await UserManager.mapAndSortElasticsearchHitToUserSearchResult(hits, userId)

        // filter out the current logged in user, since they wont be searching for themselves
        results = results.filter(r => r.userId !== userId)

        return results
    }

    /**
     * maps and sorts the elasticsearch query hit to a user search result object
     * and returns the top 10 search results
     *
     * @param items the items to be mapped and sorted
     * @param userId the current user id
     * @result the top 50 user search results if matches are found, otherwise empty list
     */
    private static async mapAndSortElasticsearchHitToUserSearchResult(items: ElasticsearchQueryHit<User>[], userId: string): Promise<UserSearchResult[]> {
        const friendships = await FriendManager.getFriendships(userId)
        return Promise.resolve(items.map(item => {
            // find friendship between userId and item._source.userId
            let friendship: Friendship = friendships.find(f => f.friendId === item._source.userId)
            if (!friendship) {
                // if there is no friendship, create a fake one that indicates there is no friendship
                friendship = {
                    userId: userId,
                    friendId: item._source.userId,
                    accepted: false,
                    requestedBy: null,
                    ctime: null
                }
            }
            return {
                userId: item._source.userId,
                name: item._source.name,
                email: item._source.email,
                ctime: item._source.ctime,
                score: item._score,
                friendship: friendship
            }
        }).sort((a: UserSearchResult, b: UserSearchResult) => b.score - a.score).slice(0, 50))
    }


    /**
     * returns all the friends for the input user id along with their friendship
     *
     * @param userId the user id of the user
     */
    public static async getFriends(userId: string): Promise<Array<Friend>> {
        logger.info("fetching friends for userId = "  + userId)
        const friendships = await FriendManager.getFriendships(userId)
        if (friendships) {
            const friends = []
            for (const friendship of friendships) {
                const friend = {
                    user: await UserManager.getUser(friendship.friendId),
                    friendship: friendship
                }
                friends.push(friend)
            }
            return Promise.resolve(friends)
        }

        return Promise.resolve([])
    }

}
