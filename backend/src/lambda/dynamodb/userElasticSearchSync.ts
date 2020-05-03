import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'
import { createLogger } from "../../utils/logger";
import { User } from "../../models/User";

const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
    hosts: [esHost],
    connectionClass: httpAwsEs
})

const logger = createLogger('userElasticSearchSync')

/**
 * The elastic search sync api handler to sync dynamodb users to to an elastic search stream.
 * This handler gets all the records from the dynamodb stream and indexes them to elastic search
 *
 * @param event the dynamodb stream event triggering the handler
 * @author Ulhas Pai
 */
export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    logger.info('Processing events batch from DynamoDB', JSON.stringify(event))
    for (const record of event.Records) {
        logger.info('Processing record ', JSON.stringify(record))

        if (record.eventName !== 'INSERT') {
            // MODIFY and REMOVE will need to be handled SEPARATELY
            continue
        }

        // construct the object to be put into elastic search
        const newItem = record.dynamodb.NewImage
        const userId = newItem.userId.S
        const body: User = {
            userId: newItem.userId.S,
            name: newItem.name ? newItem.name.S : '',
            email: newItem.email.S,
            ctime: newItem.ctime.S
        }

        // index the new item to elastic search
        logger.info('Adding record ', body)
        await es.index({
            index: 'users-index',
            type: 'users',
            id: userId,
            body
        })

    }
}
