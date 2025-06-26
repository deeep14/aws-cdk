import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib'

export class GlueJobStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const scriptLocation = 's3://your-bucket/scripts/sample-glue-script.py';
    const glueConName = cdk.Fn.importValue("glue-con-op")

    // Create IAM Role for Glue Job
    const glueRole = new iam.Role(this, 'GlueJobRole', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'),
      ],
    });

    // (Optional) Add additional permissions to access S3 or other services
    glueRole.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:*'],
      resources: ['*'], // Ideally restrict to your S3 bucket and path
    }));

    // Create the Glue Job
    new glue.CfnJob(this, 'MyGlueJob', {
      name: 'my-glue-job',
      role: glueRole.roleArn,
      command: {
        name: 'glueetl', // or 'pythonshell' for smaller jobs
        scriptLocation: scriptLocation,
        pythonVersion: '3',
      },
      glueVersion: '4.0', // or '3.0' if needed
      defaultArguments: {
        '--job-language': 'python'
      },
      connections: {
        connections: [glueConName]
      },
      maxRetries: 0,
      timeout: 10,
      numberOfWorkers: 2,
      workerType: 'G.1X', // or 'G.2X', 'G.4X' etc.
    });
  }
}
