/**
 * IFramesFileAccess interface defines all the behaviors the frames data access class should provide
 * This is useful if the data store used for application is changed in the future, or if we move
 * to another cloud provider
 */
export interface IFramesFileAccess {

    /**
     * provides a signed url to upload a file for the input id
     *
     * @param id the id for which an attachment is to be added
     */
    getSignedPutUrl(id: string): string

    /**
     * provides a signed url to download a file for the input id
     *
     * @param id the id for which an attachment is to be downloaded
     */
    getSignedGetUrl(id: string): string

    /**
     * deletes an attachment for the input id
     *
     * @param id id for which an attachment is to be deleted
     */
    deleteAttachment(id: string)
}
