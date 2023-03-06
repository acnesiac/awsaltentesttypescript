import {handler} from '../src/lambdas/SQSProcessor';
import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import {expect} from 'chai';
import {SinonFakeTimers, useFakeTimers} from 'sinon';
import moment from 'moment';
import sinon from 'sinon';

const region = process.env.AWS_REGION;
const app = process.env.APP;
const env = process.env.ENV;

describe('SQSProcessor handler', () => {
  let clock: SinonFakeTimers;

  beforeEach(function () {
    AWS.config.update({region: region});
    clock = useFakeTimers(new Date(2012, 1, 10).getTime());
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(function () {
    clock.restore();
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it.skip('should save message to DynamoDB table', async () => {
    const putStub = sinon.stub().returns({promise: sinon.stub().resolves()});
    AWSMock.mock('DynamoDB.DocumentClient', 'put', putStub);

    const event = {
      Records: [
        {
          messageId: '12345',
          receiptHandle: '12345',
          body: 'Toyota',
          attributes: {
            ApproximateReceiveCount: '1',
            SentTimestamp: '123456',
            SenderId: 'sender-id',
            ApproximateFirstReceiveTimestamp: '123456'
          },
          messageAttributes: {},
          md5OfBody: '',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:us-east-1:123456789012:my-queue',
          awsRegion: 'eu-central-1'
        },
      ],
    };

    const context = {};

    await handler(event, context);

    expect(putStub.calledOnce).to.be.true;
    expect(putStub.getCall(0).args[0]).to.deep.equal({
      TableName: `cars_brands-${app}-${env}`,
      Item: {
        id: '12345',
        brand: 'Toyota',
      },
    });
  });

  it.skip('should return 200 always', async () => {
    const event = {
      Records: [
        {
          messageId: '12345',
          body: 'Toyota',
          receiptHandle: '12345',
          attributes: {
            ApproximateReceiveCount: '1',
            SentTimestamp: '123456',
            SenderId: 'sender-id',
            ApproximateFirstReceiveTimestamp: '123456'
          },
          messageAttributes: {},
          md5OfBody: '',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:eu-central-1:774145483743:parse-document-topic.fifo',
          awsRegion: 'eu-central-1'
        },
      ],
    };

    const context = {};

    const result = await handler(event, context);

    expect(result).to.deep.equal({statusCode: 200, body: moment().utc().toISOString()});
  });
});

