import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './pipeline-stage';

interface pipelineProps extends cdk.StackProps{
  LambdaStackName: string;
  LambdaStackStageName: string;
  EC2stackName: string;
}

export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: pipelineProps) {
    super(scope, id, props);
    const pipeline = new CodePipeline(this, 'myCodePipelineAwsCdk', {
      pipelineName: 'cdk-code-pipeline',
      synth: new ShellStep('myShellStep', {
        input: CodePipelineSource.gitHub('deeep14/aws-cdk', 'cdk-cicd'),
        commands: [
          'cd cdk-cicd',
          'npm ci',
          'npx cdk synth',
          'pwd',
          'ls'
        ],
        primaryOutputDirectory: 'cdk-cicd/cdk.out'
      })
    })
    pipeline.addStage(new PipelineStage(this, 'TestStage', {
      LambdaStackName: props.LambdaStackName,
      LambdaStackStageName: props.LambdaStackStageName,
      EC2stackName: props.EC2stackName,
      env: {
        account: cdk.Stack.of(this).account,
        region: cdk.Stack.of(this).region
      }
    }))
  }
}
