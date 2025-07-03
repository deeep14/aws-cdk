import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib'
import { CdkCicdStack } from './cdk-cicd-stack';

export class GlueNetworkConnectionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromVpcAttributes(this, 'ImportedVPC', {
      vpcId: 'vpc-0febf55b79e1dd54d',
      availabilityZones: ["us-east-2a"]
    });

    const glueCon = new glue.CfnConnection(this, 'GlueNetworkConnection', {
      catalogId: this.account,
      connectionInput: {
        name: 'my-glue-vpc-connection',
        connectionType: 'NETWORK',
        physicalConnectionRequirements: {
          availabilityZone: "use2-az2",
          subnetId: "subnet-0b114bbc94005ee53",
          securityGroupIdList: ["sg-032f22cf6b66da3c3"]
        },
      },
    });
    new cdk.CfnOutput(this, 'glue-con-op', {
        value: glueCon.ref,
        exportName: "glue-con-op"
    })
  }
}
// 