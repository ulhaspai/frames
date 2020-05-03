import { User } from "../models/User";

/**
 * IFramesDataAccess interface defines all the behaviors a frames data access class should provide
 * This is useful if the data store used for the application is changed in the future, or if we move
 * to another cloud provider
 *
 * @author: Ulhas Pai
 */
export interface IFramesDataAccess {

    /**
     * returns the user object for the input userId
     *
     * @param userId the user id of the user
     * @return the user info for the user
     */
    getUser(userId: string): Promise<User>

    /**
     * creates a new user for the input data and returns the newly created user
     *
     * @param user the user to be created
     * @return the newly created user
     */
    createUser(user: User): Promise<User>
}
