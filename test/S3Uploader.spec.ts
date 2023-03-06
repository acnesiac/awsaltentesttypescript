//import { AWS.S3 } from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import sinon from 'sinon';
import {uploadToS3} from '../src/lambdas/S3Uploader';
import {AWSError} from 'aws-sdk/lib/error';
import {expect} from 'chai';
import * as AWS from 'aws-sdk';

describe('S3Uploader', () => {
  let s3UploadSpy: sinon.SinonSpy;
  let s3UploadStub: sinon.SinonStub;

  beforeEach(() => {
    s3UploadSpy = sinon.stub(AWS.S3.prototype, 'upload');
    s3UploadStub = sinon.stub(AWS.S3.prototype, 'upload');
  });

  afterEach(() => {
    sinon.restore();
  });

  it.skip('should upload file to S3 with sinon spy', (done: Mocha.Done) => {
    const s3Instance = new AWS.S3();
    const params = {Bucket: 'testbucket', Key: 'testkey'};
    const expectedData = {ETag: 'etag'};
    const expectedError = null;


    uploadToS3().then(() => {
      expect(s3UploadSpy.calledWith(sinon.match(params))).to.be.true;
      done();
    });

    //s3UploadSpy.callArgWith(1, expectedError, expectedData);
    s3UploadSpy.yield(expectedError, expectedData);

    uploadToS3().then(() => {
      expect(s3UploadStub.calledWith(sinon.match(params))).to.be.true;
      done();
    });

    //s3UploadStub.callArgWith(1, expectedError, expectedData);
    s3UploadStub.yield(expectedError, expectedData);

  });

  it.skip('should upload file to S3 with sinon stub', (done: Mocha.Done) => {
    const expectedData = {ETag: 'etag'};
    const expectedError = null;

    uploadToS3().then(() => {
      expect(s3UploadSpy.calledOnce).to.be.true;
      done();
    });

    //s3UploadSpy.callArgWith(1, expectedError, expectedData);
    s3UploadSpy.yield(expectedError, expectedData);

    uploadToS3().then(() => {
      expect(s3UploadStub.calledOnce).to.be.true;
      done();
    });

    //s3UploadStub.callArgWith(1, expectedError, expectedData);
    s3UploadStub.yield(expectedError, expectedData);

  });
});
