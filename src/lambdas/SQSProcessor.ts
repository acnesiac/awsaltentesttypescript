import * as AWS from 'aws-sdk';
//import { SQSEvent, SQSMessage } from 'aws-lambda';
import {SQSEvent, SESMessage} from 'aws-lambda';

const TABLE_NAME = 'MyTable';
const MESSAGE_ID = 'MessageId';
const MESSAGE_BODY = 'MessageBody';

//const client = new AWS.DynamoDB.DocumentClient();
const client = new AWS.DynamoDB.DocumentClient({region: process.env.AWS_REGION});
const dynamoDB = new AWS.DynamoDB();
const accountId = process.env.AWS_ACCOUNT_ID;
const region = process.env.AWS_REGION;
const app = process.env.APP;
const env = process.env.ENV;

export const handler = async (event: SQSEvent, context: any) => {
  for (const message of event.Records) {
    // Retrieve the message ID and body
    const messageId = message.messageId;
    const messageBody = message.body;

    // Create an item with the message ID and body
    const item = {
      id: messageId,
      brand: messageBody,
    };

    // Save the item in the DynamoDB table
    const params = {
      TableName: `cars_brands-${app}-${env}`,
      Item: item,
    };
    await client.put(params).promise();
  }
};
