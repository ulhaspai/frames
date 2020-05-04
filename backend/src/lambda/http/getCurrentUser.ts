import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { LambdaUtils } from '../LambdaUtils'
import { createLogger } from '../../utils/logger'
import { UserManager } from "../../business-logic/UserManager";
import { User } from "../../models/User";

const logger = createLogger('getCurrentUser')

/**
 * The get current user api handler to get the current logged in user information.
 * This handler first checks for the presence of a user for the userId,
 * - if the user exists, then it returns it
 * - if the user does not exist, then it creates a user for the user id and then returns it
 *
 * @param event the event triggering the handler
 * @author: Ulhas Pai
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Started")

    // grab the user id from the JWT payload
    const userId: string = LambdaUtils.getUserId(event)
    const userEmail: string = LambdaUtils.getUserEmail(event)
    logger.info("userId = " + JSON.stringify(userId))
    logger.info("userEmail = " + JSON.stringify(userEmail))

    // get current user
    let currentUser = await UserManager.getUser(userId)
    if (!currentUser) {
        const newUser: User = {
            userId: userId,
            email: userEmail,
            ctime: new Date().toISOString()
        }
        logger.info("creating new user = " + JSON.stringify(newUser))

        // create new user as user does not exist
        currentUser = await UserManager.createUser(newUser)
    }

    logger.info("current user = " + JSON.stringify(currentUser))
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: currentUser
        })
    }
}
