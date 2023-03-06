import {uploadToS3} from './lambdas/S3Uploader';
import {handler as s3ToSqsHandler} from './lambdas/S3ToSQS';
import {handler as sqsProcessorHandler} from './lambdas/SQSProcessor';

export const main = async () => {
  // Call S3 uploader
  await uploadToS3();

  // Add Lambda handlers
  exports.s3ToSqsHandler = s3ToSqsHandler;
  exports.sqsProcessorHandler = sqsProcessorHandler;
};

main();
