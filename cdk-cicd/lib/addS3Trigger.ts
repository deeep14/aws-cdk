import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';

export interface LambdaTriggerStackProps extends StackProps {
  bucket: s3.IBucket;
  lambdaFunc: lambda.IFunction;
}

export class LambdaTriggerStack extends Stack {
  constructor(scope: Construct, id: string, props: LambdaTriggerStackProps) {
    super(scope, id, props);

    props.bucket.grantRead(props.lambdaFunc);

    [s3.EventType.OBJECT_CREATED_PUT, 's3:ObjectCreated:CompleteMultipartUpload' as s3.EventType]
      .forEach(eventType => {
        props.bucket.addEventNotification(
          eventType,
          new s3n.LambdaDestination(props.lambdaFunc)
        );
      });
  }
}
