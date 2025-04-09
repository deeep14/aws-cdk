#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkCicdStack } from '../lib/cdk-cicd-stack';

const app = new cdk.App();
new CdkCicdStack(app, 'CdkCicdStack', {
  LambdaStackName: 'myLambdaStack',
  LambdaStackStageName: 'dev',
  EC2stackName: 'myEc2Stack',
});