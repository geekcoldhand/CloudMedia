import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = process.env.BUCKET_NAME;
const URL_EXPIRATION = 60; // 1 minute URL expiration

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const fileType = body.fileType;
        const fileName = body.fileName || `${uuidv4()}.${fileType.split('/')[1]}`;
        
      
        const s3Params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            ContentType: fileType,
            Expires: URL_EXPIRATION,

            ACL: 'private',
            Metadata: {
                'upload-timestamp': new Date().toISOString(),
            },
        };
        
        console.log('Generating S3 pre-signed URL');
        const uploadURL = new AWS.S3({ apiVersion: '2006-03-01' }).getSignedUrl('putObject', s3Params);
        
        const deletionTime = new Date();
        deletionTime.setMinutes(deletionTime.getMinutes() + 1);
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                uploadURL,
                fileName,
                fileType,
                expires: URL_EXPIRATION,
                deletionTime: deletionTime.toISOString(),
                bucketName: BUCKET_NAME,
            }),
        };
    } catch (error) {
        console.error('Error generating pre-signed URL', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: 'Failed to generate upload URL' }),
        };
    }
};