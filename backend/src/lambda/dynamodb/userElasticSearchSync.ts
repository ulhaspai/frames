import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import { createLogger } from "../../utils/logger";
import { User } from "../../models/User";
import { UserManager } from "../../business-logic/UserManager";

const logger = createLogger('userElasticSearchSync')

/**
 * The elastic search sync api handler to sync dynamodb users to to an elastic search stream.
 * This handler gets all the records from the dynamodb stream and indexes them to elastic search
 *
 * @param event the dynamodb stream event triggering the handler
 * @author Ulhas Pai
 */
export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    logger.info('Processing events batch from DynamoDB: ' + JSON.stringify(event))
    for (const record of event.Records) {
        logger.info('Processing record ' + JSON.stringify(record))

        if (record.eventName !== 'INSERT') {
            // MODIFY and REMOVE will need to be handled SEPARATELY
            continue
        }

        // construct the object to be put into elastic search
        const newItem = record.dynamodb.NewImage
        const user: User = {
            userId: newItem.userId.S,
            name: newItem.name ? newItem.name.S : '',
            email: newItem.email.S,
            ctime: newItem.ctime.S
        }

        // index the new item to elastic search
        logger.info('Adding record ' +  JSON.stringify(user))
        await UserManager.indexUser(user)
    }
}
