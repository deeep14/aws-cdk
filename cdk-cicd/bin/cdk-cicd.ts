#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkCicdStack } from '../lib/cdk-cicd-stack';

const app = new cdk.App();
new CdkCicdStack(app, 'CdkCicdStack', {
  LambdaStackName: 'myLambdaStack',
  LambdaStackStageName: 'dev',
  EC2stackName: 'myEc2Stack',
  vpcId: 'vpc-033a8a5e822d62f3f',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
  instanceId: 'i-07478e9518641587d',
  ScriptUploadStack: 'ScriptUploadStack',
  scriptPath: '../script/myscript.sh',
  UploadToS3Stack: 'MyS3BucketUploadStack01',
  BucketLogicalId: 'MyS3UploadBucket',
  BucketName: 'snowflake-test-s3'
});