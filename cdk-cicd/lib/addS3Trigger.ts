import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cr from 'aws-cdk-lib/custom-resources';

interface S3EventTriggerStackProps extends cdk.StackProps {
  existingBucketArn: string;
  lambdaFunction: lambda.IFunction;
}

export class S3EventTriggerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: S3EventTriggerStackProps) {
    super(scope, id, props);

    // Import existing bucket using ARN
    const existingBucket = s3.Bucket.fromBucketArn(this, 'ImportedBucket', props.existingBucketArn);

    // Role for custom resource
    const customResourceRole = new iam.Role(this, 'CustomResourceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    });

    // Allow custom resource to configure S3 notifications
    customResourceRole.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:PutBucketNotification', 's3:PutBucketNotificationConfiguration'],
      resources: [props.existingBucketArn]
    }));

    // Attach required Lambda invoke permission for this bucket
    new lambda.CfnPermission(this, 'S3InvokeLambdaPermission', {
      action: 'lambda:InvokeFunction',
      functionName: props.lambdaFunction.functionName,
      principal: 's3.amazonaws.com',
      sourceArn: props.existingBucketArn,
      sourceAccount: cdk.Stack.of(this).account,
    });

    // Add the S3 notification config via AwsCustomResource
    new cr.AwsCustomResource(this, 'S3NotificationConfigurer', {
      onCreate: {
        service: 'S3',
        action: 'putBucketNotificationConfiguration',
        parameters: {
          Bucket: existingBucket.bucketName,
          NotificationConfiguration: {
            LambdaFunctionConfigurations: [
              {
                Events: [
                  's3:ObjectCreated:Put',
                  's3:ObjectCreated:CompleteMultipartUpload'
                ],
                LambdaFunctionArn: props.lambdaFunction.functionArn
              }
            ]
          }
        },
        physicalResourceId: cr.PhysicalResourceId.of('S3NotificationConfig')
      },
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: ['s3:PutBucketNotificationConfiguration'],
          resources: [props.existingBucketArn]
        })
      ]),
      role: customResourceRole
    });
  }
}
