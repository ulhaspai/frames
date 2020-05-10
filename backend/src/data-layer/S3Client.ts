import * as AWS from "aws-sdk"
import { IFramesFileAccess } from "./IFramesFileAccess";

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(require('aws-sdk'))

/**
 * S3Client is an AWS implementation for the {@link IFramesFileAccess}
 */
export class S3Client implements IFramesFileAccess {

    private static readonly BUCKET_NAME: string = process.env.S3_BUCKET_NAME
    private static readonly URL_EXPIRATION: string = process.env.S3_UPLOAD_URL_EXPIRATION

    private s3: AWS.S3

    constructor() {
        this.s3 = new XAWS.S3({
            signatureVersion: 'v4'
        })
    }

    public async deleteAttachment(id: string) {
        await this.s3.deleteObject({
            Bucket: S3Client.BUCKET_NAME,
            Key: id
        }).promise()
    }

    public getSignedPutUrl(id: string): string {
        return this.s3.getSignedUrl('putObject', {
            Bucket: S3Client.BUCKET_NAME,
            Key: id,
            Expires: parseInt(S3Client.URL_EXPIRATION)
        })
    }

    public getSignedGetUrl(id: string): string {
        return this.s3.getSignedUrl('getObject', {
            Bucket: S3Client.BUCKET_NAME,
            Key: id,
            Expires: parseInt(S3Client.URL_EXPIRATION)
        })
    }

}
