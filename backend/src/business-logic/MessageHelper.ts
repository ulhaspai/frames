
export class MessageHelper {

    /**
     * finds a conversation stream index name for the input user and friend id
     *
     * @param userId the current user id
     * @param friendId the friend id with whom the conversation index is needed
     * @return the elastic search index name
     */
    public static getChatStreamName(userId: string, friendId: string) {
        let ids = [userId, friendId]
        ids.sort()
        ids = ids.map(id => id.replace("auth0|", ""))
        return ids[0] + "-" + ids[1]
    }
}
