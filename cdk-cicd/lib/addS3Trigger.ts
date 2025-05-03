import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

export interface LambdaTriggerStackProps extends StackProps {
  bucket: s3.IBucket;
  lambdaFunc: lambda.IFunction;
}

export class LambdaTriggerStack extends Stack {
  constructor(scope: Construct, id: string, props: LambdaTriggerStackProps) {
    super(scope, id, props);

    props.bucket.grantRead(props.lambdaFunc);

    const bucketResource = props.bucket.node.defaultChild as s3.CfnBucket;

    bucketResource.addPropertyOverride('NotificationConfiguration.LambdaConfigurations', [
      {
        Event: 's3:ObjectCreated:Put',
        Function: props.lambdaFunc.functionArn,
      },
      {
        Event: 's3:ObjectCreated:CompleteMultipartUpload',
        Function: props.lambdaFunc.functionArn,
      }
    ]);

    props.lambdaFunc.addPermission('S3InvokePermission', {
      principal: new iam.ServicePrincipal('s3.amazonaws.com'),
      sourceArn: props.bucket.bucketArn,
    });
  }
}
