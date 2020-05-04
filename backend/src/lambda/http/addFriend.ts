import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { LambdaUtils } from '../LambdaUtils'
import { createLogger } from '../../utils/logger'
import { FriendManager } from "../../business-logic/FriendManager";


const logger = createLogger('addFriend')

/**
 * The add friend api handler to get add a user in the system as a friend.
 * This handler first checks that the user is not already a friend and then adds if they are not
 *
 * @param event the event triggering the handler
 * @author: Ulhas Pai
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Started")

    // grab the user id from the JWT payload
    const userId: string = LambdaUtils.getUserId(event)
    const friendId: string = event.pathParameters.friendId

    logger.info("userId = " + JSON.stringify(userId))
    logger.info("friendId = " + JSON.stringify(friendId))

    // add a friend
    await FriendManager.addFriend(userId, friendId)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(null)
    }
}
