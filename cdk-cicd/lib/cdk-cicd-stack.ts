import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new CodePipeline(this, 'myCodePipelineAwsCdk', {
      pipelineName: 'myCodePipelineAwsCdk',
      synth: new ShellStep('myShellStep', {
        input: CodePipelineSource.gitHub('deeep14/aws-cdk', 'cdk-cicd'),
        commands: [
          'pwd',
          'ls'
        ],
      })
    })
  }
}
