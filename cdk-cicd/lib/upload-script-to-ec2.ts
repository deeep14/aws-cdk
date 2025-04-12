import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';

interface uploadScriptProps extends cdk.StackProps {
    instanceId: string;
}

export class ScriptUploadStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: uploadScriptProps) {
    super(scope, id, props);

    const instanceId = props.instanceId;
    const scriptContent = `#!/bin/bash
echo "Hello from CDK script!" > /home/ec2-user/hello.sh
chmod +x /home/ec2-user/hello.sh
`;

    new ssm.CfnAssociation(this, 'UploadScriptAssociation', {
      name: 'AWS-RunShellScript',
      instanceId,
      parameters: {
        commands: [scriptContent]
      }
    });
  }
}
