import {handler} from '../src/lambdas/S3ToSQS';
import {expect} from 'chai';
import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import {SinonStub} from 'sinon';
import {S3Event} from 'aws-lambda';
const sinon = require('sinon');

const s3Event: S3Event = {
  Records: [
    {
      eventVersion: '2.0',
      eventSource: 'aws:s3',
      awsRegion: 'eu-central-1',
      eventTime: '2021-12-31T23:59:59.999Z',
      eventName: 'ObjectCreated:Put',
      userIdentity: {
        principalId: 'EXAMPLE'
      },
      requestParameters: {
        sourceIPAddress: '127.0.0.1'
      },
      responseElements: {
        'x-amz-request-id': 'EXAMPLE123456789',
        'x-amz-id-2': 'EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH'
      },
      s3: {
        s3SchemaVersion: '1.0',
        configurationId: 'testConfigRule',
        bucket: {
          name: 'test-bucket',
          ownerIdentity: {
            principalId: 'EXAMPLE'
          },
          arn: 'arn:aws:s3:::example-bucket'
        },
        object: {
          key: 'test-file.txt',
          size: 1024,
          eTag: '0123456789abcdef0123456789abcdef',
          sequencer: '0A1B2C3D4E5F678901'
        }
      }
    }
  ]
};

interface S3Bucket {
  name: string;
  ownerIdentity: {
    principalId: string;
  };
  arn: string;
}

describe('S3ToSQS handler', () => {
  let sendMessageStub: sinon.SinonStub;
  let deleteObjectStub: sinon.SinonStub;

  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
    sendMessageStub = sinon.stub().returns({
      promise: () => Promise.resolve({})
    });
    deleteObjectStub = sinon.stub().returns({
      promise: () => Promise.resolve({})
    });
    AWSMock.mock('SQS', 'sendMessage', sendMessageStub);
    AWSMock.mock('S3', 'deleteObject', deleteObjectStub);
  });

  afterEach(() => {
    AWSMock.restore('SQS');
    AWSMock.restore('S3');
  });

  it.skip('should send message to SQS and delete file from S3', async () => {
    const result = await handler(s3Event);

    expect(sendMessageStub.calledOnce).to.be.true;
    expect(sendMessageStub.firstCall.args[0]).to.deep.equal({
      QueueUrl: 'https://sqs.eu-central-1.amazonaws.com/123456789012/sqs-my-app-my-env.fifo',
      MessageBody: 'Hello world',
      MessageGroupId: 'my-message-group-id',
      MessageDeduplicationId: 'Hello world'
    });
    expect(deleteObjectStub.calledOnce).to.be.true;
    expect(deleteObjectStub.firstCall.args[0]).to.deep.equal({
      Bucket: 'test-bucket',
      Key: 'test-file.txt'
    });
    expect(result).to.equal('Success');
  });

  it.skip('should return "Error" when an error occurs', async () => {
    sendMessageStub.throws(new Error('SQS error'));

    const result = await handler(s3Event);

    expect(sendMessageStub.calledOnce).to.be.true;
    expect(result).to.equal('Error');
  });
});
