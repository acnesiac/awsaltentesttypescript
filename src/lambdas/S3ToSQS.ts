import {S3Event, S3EventRecord} from "aws-lambda";
import {S3, SQS} from "aws-sdk";
import {Readable, Writable} from "stream";

export const handler = async (event: S3Event): Promise<string> => {
  const s3 = new S3();
  const sqs = new SQS();
  const accountId = process.env.AWS_ACCOUNT_ID;
  const region = process.env.AWS_REGION;
  const app = process.env.APP;
  const env = process.env.ENV;

  try {
    const record: S3EventRecord = event.Records[0];
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key.replace(/\+/g, " ");
    const s3Object = await s3.getObject({Bucket: bucket, Key: key}).promise();
    const inputStream = s3Object.Body as Readable;
    const outputStream = new Writable({
      write: async (chunk, encoding, callback) => {
        const sendMessageRequest: SQS.SendMessageRequest = {
          QueueUrl: `https://sqs.${region}.amazonaws.com/${accountId}/sqs-${app}-${env}.fifo`,
          MessageBody: chunk.toString(),
          MessageGroupId: "my-message-group-id",
          MessageDeduplicationId: chunk.toString(),
        };
        await sqs.sendMessage(sendMessageRequest).promise();
        callback();
      },
    });
++
    inputStream.pipe(outputStream);

    await s3.deleteObject({Bucket: bucket, Key: key}).promise();
    return "Success";
  } catch (error) {
    console.error(error);
    return "Error";
  }
};
