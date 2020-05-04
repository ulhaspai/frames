import { IStreamDataAccess } from "./IStreamDataAccess";
import { ElasticsearchQueryHit } from "../models/ElasticsearchQueryHit";
import * as elasticsearch from "elasticsearch";
import * as httpAwsEs from 'http-aws-es'
import { User } from "../models/User";

const esHost = process.env.ES_ENDPOINT
const usersIndex = process.env.ES_USERS_INDEX
const usersIndexType = process.env.ES_USERS_INDEX_TYPE

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

    async index(user: User): Promise<any> {
        return this.es.index({
            index: usersIndex,
            type: usersIndexType,
            id: user.userId,
            body: user
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

}
