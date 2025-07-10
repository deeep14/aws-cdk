import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';

export interface S3ToSqsStackProps extends StackProps {
  bucket: s3.IBucket;
}

export class S3ToSqsStack extends Stack {
  public readonly queue: sqs.Queue;

  constructor(scope: Construct, id: string, props: S3ToSqsStackProps) {
    super(scope, id, props);

    this.queue = new sqs.Queue(this, 'MyQueue', {
      visibilityTimeout: Duration.seconds(30),
    });

    props.bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.SqsDestination(this.queue)
    );
  }
}
