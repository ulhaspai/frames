import { IFramesDataAccess } from "../data-layer/IFramesDataAccess";
import { FramesDocumentClient } from "../data-layer/FramesDocumentClient";
import { createLogger } from "../utils/logger";
import { Friendship } from '../models/Friendship'

const framesDataAccess: IFramesDataAccess = new FramesDocumentClient()

const logger = createLogger('FriendManager')

/**
 * Friend manager provides all the business logic related to friendship for the frames application
 *
 * @author: Ulhas Pai
 */
export class FriendManager {

    /**
     * add a new friend
     *
     * @param userId user id of the user adding the friend
     * @param friendId user id of the person being added as a friend
     */
    static async addFriend(userId: string, friendId: string) : Promise<void> {
        const ctime = new Date().toISOString()
        const friendship1: Friendship = {
            userId: userId,
            friendId: friendId,
            accepted: true,
            requestedBy: userId,
            ctime
        }
        const friendship = await FriendManager.getFriendship(userId, friendId)
        if(friendship) {
            if (!friendship.accepted) {
                logger.info("accepting a friend request = " + JSON.stringify(friendship1))
                await framesDataAccess.addFriend(friendship1)
            }
        } else {
            // request a friendship to the other person
            const friendship2: Friendship = {
                userId: friendId,
                friendId: userId,
                accepted: false,
                requestedBy: userId,
                ctime
            }
            logger.info("creating a new friendship1 = " + JSON.stringify(friendship1))
            await framesDataAccess.addFriend(friendship1)

            logger.info("requesting a new friendship2 = " + JSON.stringify(friendship2))
            await framesDataAccess.addFriend(friendship2)
        }
        return Promise.resolve();
    }

    /**
     * @param userId the user id of the user
     * @return all friendships for the user
     */
    static async getFriendships(userId: string) : Promise<Array<Friendship>> {
        return framesDataAccess.getFriendships(userId)
    }

    /**
     * @param userId the user id of the user
     * @param friendId the user id of the friend
     * @return the friendships if exists
     */
    static async getFriendship(userId: string, friendId: string) : Promise<Friendship> {
        const friendships = await FriendManager.getFriendships(userId)
        const friends = friendships.filter(f => f.friendId === friendId);
        return Promise.resolve(friends.length > 0 ? friends[0] : null)
    }

    /**
     * tells whether userId has a friendship for friendId
     *
     * @param userId user id of the user
     * @param friendId user id of the friend
     */
    static async isAFriend(userId: string, friendId: string) : Promise<boolean> {
        const friendship = await FriendManager.getFriendship(userId, friendId)
        return Promise.resolve(!!friendship)
    }
}
