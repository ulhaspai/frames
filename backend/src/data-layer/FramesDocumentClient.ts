import * as AWS from 'aws-sdk'

import { createLogger } from '../utils/logger'
import { IFramesDataAccess } from './IFramesDataAccess'
import { User } from '../models/User'
import { Friendship } from "../models/Friendship"

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
    private static readonly FRIEND_TABLE: string = process.env.FRIEND_TABLE

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
            logger.info(" Error creating user" + JSON.stringify(err))
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

            return result.Count != 0
                ? Promise.resolve(FramesDocumentClient.convertDbItemToUser(result.Items[0]))
                : Promise.resolve(null)
        } catch (err) {
            logger.info(" Error getting user" + JSON.stringify(err))
            return Promise.reject(err)
        }
    }

    // async getUsers(userIds: string[]): Promise<User[]> {
    //     try {
    //         if (userIds && userIds.length > 0) {
    //             let condition = 'userId IN ('
    //             for (let i = 0; i < userIds.length; i++) {
    //                 condition += (`:userId${i}` + (i !== userIds.length-1 ? ',' : ')') )
    //             }
    //             const result = await this.documentClient.query({
    //                 TableName: FramesDocumentClient.USER_TABLE,
    //                 KeyConditionExpression: condition,
    //                 ExpressionAttributeValues: {
    //                     ':userId': userId
    //                 }
    //             }).promise()
    //
    //             return result.Count != 0
    //                 ? Promise.resolve(FramesDocumentClient.convertDbItemToUser(result.Items))
    //                 : Promise.resolve([])
    //         }
    //         return Promise.resolve([])
    //     } catch (err) {
    //         logger.info("Error getting users : " + JSON.stringify(err))
    //         return Promise.reject(err)
    //     }
    // }

    async addFriend(friendship: Friendship): Promise<Friendship> {
        try {
            await this.documentClient.put({
                TableName: FramesDocumentClient.FRIEND_TABLE,
                Item: friendship
            }).promise()
            return Promise.resolve(friendship)
        } catch (err) {
            logger.info(" Error creating friendship" + JSON.stringify(err))
            return Promise.reject(err)
        }
    }

    async getFriendships(userId: string): Promise<Array<Friendship>> {
        try {
            const result = await this.documentClient.query({
                TableName: FramesDocumentClient.FRIEND_TABLE,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            }).promise()

            return result.Count > 0 ?
                result.Items.map(item => FramesDocumentClient.convertDbItemToFriendship(item))
                : []
        } catch (err) {
            logger.info(" Error fetching friendships " + JSON.stringify(err))
            return Promise.reject(err)
        }
    }

    /**
     * converts a dynamodb item to a friendship object
     *
     * @param dbItem the dynamodb data item
     */
    private static convertDbItemToFriendship(dbItem: AWS.DynamoDB.DocumentClient.AttributeMap): Friendship {
        return {
            userId: dbItem.userId,
            friendId: dbItem.friendId,
            accepted: dbItem.accepted,
            requestedBy: dbItem.requestedBy,
            ctime: dbItem.ctime
        }
    }

}
