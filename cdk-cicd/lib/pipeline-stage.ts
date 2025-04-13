import { Stack, StackProps, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaStack } from "./lambda-stack";
import { Ec2InstanceCdkStack } from "./ec2-stack";
import { ScriptUploadStack } from "./upload-script-to-ec2";
import { UploadToS3Stack } from "./upload-files-to-s3";

interface PipelineStageStackProps extends StackProps {
    LambdaStackName: string;
    LambdaStackStageName: string;

    EC2stackName: string;
    vpcId: string;

    ScriptUploadStack: string;
    instanceId: string;
    scriptPath: string;

    UploadToS3Stack: string;
    BucketLogicalId: string;
    BucketName:string;
}

export class PipelineStage extends Stage{
    constructor(scope: Construct, id: string, props: PipelineStageStackProps){
        super(scope, id, props);
        new LambdaStack(this, props.LambdaStackName, {
            stageName: props.LambdaStackStageName
        })
        new Ec2InstanceCdkStack(this, props.EC2stackName, {
            env: props.env,
            vpcId: props.vpcId
        })
        new ScriptUploadStack(this, props.ScriptUploadStack, {
            instanceId: props.instanceId,
            scriptPath: props.scriptPath
        })
        new UploadToS3Stack(this, props.UploadToS3Stack, {
            BucketLogicalId: props.BucketLogicalId,
            BucketName: props.BucketName
        })
    }
}