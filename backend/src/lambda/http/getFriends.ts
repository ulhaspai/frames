import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { LambdaUtils } from '../LambdaUtils'
import { createLogger } from '../../utils/logger'
import { UserManager } from "../../business-logic/UserManager";

const logger = createLogger('getFriends')

/**
 * The get friends api handler to get the current logged in user's list of friends
 *
 * @param event the event triggering the handler
 * @author: Ulhas Pai
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Started")

    // grab the user id from the JWT payload
    const userId: string = LambdaUtils.getUserId(event)
    logger.info("userId = " + JSON.stringify(userId))

    // get friends
    const friends = await UserManager.getFriends(userId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            items: friends
        })
    }
}
