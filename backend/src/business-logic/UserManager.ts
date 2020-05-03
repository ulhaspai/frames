import { createLogger } from "../utils/logger";
import { IFramesDataAccess } from "../data-layer/IFramesDataAccess";
import { FramesDocumentClient } from "../data-layer/FramesDocumentClient";
import { User } from "../models/User";

const userDataAccess: IFramesDataAccess = new FramesDocumentClient()

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
        logger.info("creating a new user", user)
        return userDataAccess.createUser(user)
    }

    /**
     * @param userId the user id of the user
     * @return the user for the input user id if exists, otherwise null
     */
    static async getUser(userId: string): Promise<User> {
        logger.info("get user for user id", userId)
        return userDataAccess.getUser(userId)
    }
}
