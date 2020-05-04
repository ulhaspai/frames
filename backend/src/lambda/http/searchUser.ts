import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { LambdaUtils } from '../LambdaUtils'
import { createLogger } from '../../utils/logger'
import { UserSearchResult } from "../../models/UserSearchResult";
import { UserManager } from "../../business-logic/UserManager";

const logger = createLogger('searchUser')

/**
 * The search user api handler to search a user in the system.
 * This handler searches the user in the elastic search user index,
 * - if matches are found, then all the matches are returned
 * - if matches are not found, then it returns an empty list
 *
 * @param event the event triggering the handler
 * @author: Ulhas Pai
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Started")

    // grab the user id from the JWT payload, to authenticate and authorize the user
    const userId = LambdaUtils.getUserId(event)
    const searchTerm = event.queryStringParameters.query

    let results: Array<UserSearchResult>;

    // so now we query elasticsearch
    results = await UserManager.searchUsers(searchTerm, userId)
    logger.info("search results = " + JSON.stringify(results))

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            items: results
        })
    }
}


