import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as fs from 'fs';
import * as path from 'path';

interface uploadScriptProps extends cdk.StackProps {
    instanceId: string;
    scriptPath: string;
}

export class ScriptUploadStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: uploadScriptProps) {
    super(scope, id, props);

    const instanceId = props.instanceId;
    const scriptPath = path.join(__dirname, '../script/myscript.sh');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');

    new ssm.CfnAssociation(this, 'UploadScriptAssociation', {
      name: 'AWS-RunShellScript',
      instanceId,
      parameters: {
        commands: [scriptContent]
      }
    });
  }
}
