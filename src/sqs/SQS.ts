import aws from 'aws-sdk';

aws.config.update({
  iam: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'us-east-1',
});

export const sqs = new aws.SQS({ apiVersion: '2012-11-05' });
