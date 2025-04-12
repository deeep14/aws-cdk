import { Stack, StackProps, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaStack } from "./lambda-stack";
import { Ec2InstanceCdkStack } from "./ec2-stack";
import { ScriptUploadStack } from "./upload-script-to-ec2";

interface PipelineStageStackProps extends StackProps {
    LambdaStackName: string;
    LambdaStackStageName: string;

    EC2stackName: string;

    ScriptUploadStack: string;
    instanceId: string;
}

export class PipelineStage extends Stage{
    constructor(scope: Construct, id: string, props: PipelineStageStackProps){
        super(scope, id, props);
        new LambdaStack(this, props.LambdaStackName, {
            stageName: props.LambdaStackStageName
        })
        new Ec2InstanceCdkStack(this, props.EC2stackName, {
            env: props.env
        })
        new ScriptUploadStack(this, props.ScriptUploadStack, {
            instanceId: props.instanceId
        })
    }
}