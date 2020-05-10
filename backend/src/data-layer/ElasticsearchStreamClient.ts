import { IStreamDataAccess } from "./IStreamDataAccess";
import { ElasticsearchQueryHit } from "../models/ElasticsearchQueryHit";
import * as elasticsearch from "elasticsearch";
import * as httpAwsEs from 'http-aws-es'
import { User } from "../models/User";
import { TextMessage } from "../models/messages/Message";
import { MessageHelper } from "../business-logic/MessageHelper";
import { createLogger } from "../utils/logger";
import * as UUID from 'uuid';

const esHost = process.env.ES_ENDPOINT
const usersIndex = process.env.ES_USERS_INDEX
const usersIndexType = process.env.ES_USERS_INDEX_TYPE
const messageIndexType = process.env.ES_MESSAGE_INDEX_TYPE

const logger = createLogger('ESStreamClient')

/**
 * ElasticSearchStreamClient is an elasticsearch implementation of the {@link IStreamDataAccess}
 * This client is used to index and query a stream data source which in this case is Elasticsearch
 *
 * @author Ulhas Pai
 */
export class ElasticsearchStreamClient implements IStreamDataAccess {

    private readonly es: elasticsearch.Client

    constructor() {
        this.es = new elasticsearch.Client({
            hosts: [esHost],
            connectionClass: httpAwsEs
        })
    }

    async ping(): Promise<any> {
        return await this.es.ping({
            // ping usually has a 3000ms timeout
            requestTimeout: 3000
        })
    }

    async indexUser(user: User): Promise<any> {
        return this.es.index({
            index: usersIndex,
            type: usersIndexType,
            id: user.userId,
            body: user
        })
    }

    async sendMessage(message: TextMessage): Promise<any> {
        const indexName = MessageHelper.getChatStreamName(message.senderUserId, message.receiverUserId)
        const indexId = UUID.v4()
        logger.info("sending message to index id = " + indexId + " index name = " + indexName)
        return this.es.index({
            index: indexName,
            type: messageIndexType,
            id: indexId,
            body: message
        })
    }

    async search<T>(query: string): Promise<Array<ElasticsearchQueryHit<T>>> {
        const params = {
            index: usersIndex,
            body: {
                "query": {
                    "regexp": {
                        "email": {
                            "value": `.*${query}.*`
                        }
                    }
                }
            }
        }
        console.log(params)
        const response = await this.es.search<T>(params)
        return response.hits.hits
    }

    async getMessages<T>(userId: string, friendId: string, fromTimestamp: Date, toTimestamp: Date): Promise<Array<ElasticsearchQueryHit<T>>> {
        const indexName = MessageHelper.getChatStreamName(userId, friendId)
        logger.info(`fetching conversation between ${userId} and ${friendId}. Index Name = ${indexName}`)
        const params = {
            index: indexName,
            body: {
                "from": 0,
                "size": 1000,
                "query": {
                    "range": {
                        "timestamp": {
                            "gte": fromTimestamp.toISOString(),
                            "lt": toTimestamp.toISOString()
                        }
                    }
                }
            }
        }
        console.log(params)
        const response = await this.es.search<T>(params)
        return response.hits.hits
    }


}
