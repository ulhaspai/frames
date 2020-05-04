/**
 * copy of elastic search query hit object
 */
export interface ElasticsearchQueryHit<T> {
    _index: string
    _type: string
    _id: string
    _score: number
    _source: T
    _version?: number
    explanation?: Explanation
    fields?: any
    highlight?: any
    inner_hits?: any
    matched_queries?: string[]
    sort?: string[]
}

/**
 * copy of explanation interface from the search response
 */
export interface Explanation {
    value: number
    description: string
    details: Explanation[]
}
