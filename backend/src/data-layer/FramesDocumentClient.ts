import * as AWS from 'aws-sdk'

import { createLogger } from '../utils/logger'
import { IFramesDataAccess } from './IFramesDataAccess'
import { User } from '../models/User'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(require('aws-sdk'))

const logger = createLogger('TodoDocumentClient')

/**
 * FramesDocumentClient is an AWS implementation for the {@link IFramesDataAccess}
 *
 * @author Ulhas Pai
 */
export class FramesDocumentClient implements IFramesDataAccess {

    private readonly documentClient: AWS.DynamoDB.DocumentClient
    private static readonly USER_TABLE: string = process.env.USER_TABLE

    constructor() {
        this.documentClient = FramesDocumentClient.getDynamoDBClient()
    }

    /**
     * creates an instance of the dynamo db document client
     */
    private static getDynamoDBClient(): AWS.DynamoDB.DocumentClient {
        if (process.env.IS_OFFLINE) {
            logger.info('Creating a local DynamoDB instance')
            return new AWS.DynamoDB.DocumentClient({
                region: 'localhost',
                endpoint: 'http://localhost:8000'
            })
        }

        return new XAWS.DynamoDB.DocumentClient()
    }

    /**
     * converts a db item to user object
     *
     * @param dbItem the db item to be converted
     */
    private static convertDbItemToUser(dbItem: AWS.DynamoDB.DocumentClient.AttributeMap): User {
        return {
            userId: dbItem.userId,
            name: dbItem.name,
            email: dbItem.email,
            ctime: dbItem.ctime
        }
    }

    async createUser(user: User): Promise<User> {
        try {
            await this.documentClient.put({
                TableName: FramesDocumentClient.USER_TABLE,
                Item: user
            }).promise()
            return Promise.resolve(user)
        } catch (err) {
            logger.info(" Error creating user", err)
            return Promise.reject(err)
        }
    }

    async getUser(userId: string): Promise<User> {
        try {
            const result = await this.documentClient.query({
                TableName: FramesDocumentClient.USER_TABLE,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            }).promise()

            if (result.Count != 0) {
                return Promise.resolve(FramesDocumentClient.convertDbItemToUser(result.Items[0]))
            }
            return Promise.resolve(null)
        } catch (err) {
            logger.info(" Error getting user", err)
            return Promise.reject(err)
        }
    }


}
