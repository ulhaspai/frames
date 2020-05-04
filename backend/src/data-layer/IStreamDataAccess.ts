import { ElasticsearchQueryHit } from "../models/ElasticsearchQueryHit";
import { User } from "../models/User";


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
    index(user: User): Promise<any>

    /**
     * returns the elastic search query results for the input query string
     *
     * @param query the string to be searched
     * @return the search results if matches are found
     */
    search<T>(query: string): Promise<Array<ElasticsearchQueryHit<T>>>

}
