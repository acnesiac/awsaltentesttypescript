import {S3} from 'aws-sdk';
import {Readable} from 'stream';

const BUCKET = process.env.BUCKET ?? 'aws-s3-bucket-35';
const KEY_NAME = 'vehicles.txt';
const RESOURCE_PATH = 'resources/vehicles.txt';

const s3 = new S3();

export async function uploadToS3(): Promise<void> {
  try {
    const inputStream = new Readable();
    const resourceUrl = RESOURCE_PATH;

    if (!resourceUrl) {
      throw new Error(`Resource not found: ${RESOURCE_PATH}`);
    }

    inputStream.push(resourceUrl);
    inputStream.push(null);

    const params = {
      Bucket: BUCKET,
      Key: KEY_NAME,
      Body: inputStream,
      ContentType: 'text/plain',
    };

    const {ETag} = await s3.upload(params).promise();

    console.log(`File uploaded to S3 bucket ${BUCKET} with ETag ${ETag}`);
  } catch (error) {
    console.error(`Error uploading file to S3: ${error}`);
  }
}
