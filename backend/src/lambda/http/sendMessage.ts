import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { LambdaUtils } from '../LambdaUtils'
import { createLogger } from '../../utils/logger'
import { FriendManager } from "../../business-logic/FriendManager";
import { TextMessage } from "../../models/messages/Message";
import { UserManager } from "../../business-logic/UserManager";


const logger = createLogger('sendMessage')

/**
 * The send message api handler to send a message to a friend.
 *
 * @param event the event triggering the handler
 * @author: Ulhas Pai
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Started")

    // grab the user id from the JWT payload
    const userId: string = LambdaUtils.getUserId(event)
    const message: TextMessage = JSON.parse(event.body)


    // | (pipes) are a problem, so client will encode and send the friendId
    const friendId: string = message.receiverUserId
    if (await FriendManager.isAFriend(userId, friendId)) {
        message.senderUserId = userId
        message.timestamp = new Date().toISOString()

        try {
            const result = await UserManager.sendMessage(message)
            logger.info("index result = " + JSON.stringify(result))

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: JSON.stringify(null)
            }
        } catch (err) {
            logger.info("ERROR : " + JSON.stringify(err))
            console.log("ERROR:::", err)
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: JSON.stringify(null)
            }
        }
    }
}
