import { ElasticsearchQueryHit } from "../models/ElasticsearchQueryHit";
import { User } from "../models/User";
import { TextMessage } from "../models/messages/Message";


/**
 * IStreamDataAccess interface defines all the behaviors a frames strea data access class should provide
 * This is useful if the stream used for indexing and querying for the application is changed in the future,
 * or if we move to another cloud provider
 *
 * @author: Ulhas Pai
 */
export interface IStreamDataAccess {

    /**
     * pings the server to check all's well
     */
    ping(): Promise<any>

    /**
     * indexes the provided user for the user id to stream data source
     *
     * @param user the user to be indexed
     */
    indexUser(user: User): Promise<any>

    /**
     * returns the elastic search query results for the input query string
     *
     * @param query the string to be searched
     * @return the search results if matches are found
     */
    search<T>(query: string): Promise<Array<ElasticsearchQueryHit<T>>>

    /**
     * indexes the provided message into the relationship stream
     *
     * @param message the message to be sent
     */
    sendMessage(message: TextMessage): Promise<any>;

    /**
     * fetches the conversation between the the input userId and the friendId for the specified time range
     *
     * @param userId current user id
     * @param friendId the friend id
     * @param fromTimestamp the starting date and time value (gte)
     * @param toTimestamp the ending date and time value (lt)
     */
    getMessages<T>(userId: string, friendId: string, fromTimestamp: Date, toTimestamp: Date): Promise<Array<ElasticsearchQueryHit<T>>>

}
