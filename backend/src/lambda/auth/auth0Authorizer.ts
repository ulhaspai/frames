import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { JwkClient } from '../../auth/JwkClient'

const logger = createLogger('auth')

/**
 * Authorization handler to authorize a user session.
 * This handler is used by all event handlers to authorize the user before the proceed can proceed
 *
 * @param event the authorizer event
 * @author: Ulhas Pai
 */
export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    logger.info('Authorizing a user for token = ' + event.authorizationToken)
    try {
        const jwtToken = await JwkClient.verifyToken(event.authorizationToken)
        logger.info('User authorized')
        logger.info('JWT = ' + jwtToken)

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }
    } catch (e) {
        logger.error('User not authorized. Error = ', {error: e.message})

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}
