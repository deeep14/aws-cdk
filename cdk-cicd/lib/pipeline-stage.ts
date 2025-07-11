import { Stack, StackProps, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaStack } from "./lambda-stack";
import { Ec2InstanceCdkStack } from "./ec2-stack";
import { ScriptUploadStack } from "./upload-script-to-ec2";
import { UploadToS3Stack } from "./upload-files-to-s3";
import { ImportBucketStack } from "./imports3stack";
import { S3EventTriggerStack } from "./addS3Trigger";
import { GlueJobStack } from "./glue-job";
import { GlueNetworkConnectionStack } from "./glue-network-connection";
import * as cdk from 'aws-cdk-lib'
import { S3ToSqsStack } from "./s3-to-sqs-stack";
import { SqsToLambdaStack } from "./sqs-to-lambda-stack";

interface PipelineStageStackProps extends StackProps {
    LambdaStackName: string;
    LambdaStackStageName: string;
    lambdaName: string;

    EC2stackName: string;
    vpcId: string;

    ScriptUploadStack: string;
    instanceId: string;
    scriptPath: string;

    UploadToS3Stack: string;
    BucketLogicalId: string;
    BucketName: string;

    importBucketStack: string;
    bucketArn: string;

    lambdaTriggerStack: string;
    S3ToSqsStack: string;
    SqsToLambdaStack: string;
}

export class PipelineStage extends Stage {
    constructor(scope: Construct, id: string, props: PipelineStageStackProps) {
        super(scope, id, props);
        const lambdaInstace = new LambdaStack(this, props.LambdaStackName, {
            stageName: props.LambdaStackStageName,
            lambdaName: props.lambdaName
        })
        const importedBucketInstance = new ImportBucketStack(this, props.importBucketStack, {
            bucketArn: props.bucketArn,
            importBucketStack: props.importBucketStack
        })
        const s3ToSqsQueue = new S3ToSqsStack(this, props.S3ToSqsStack, {
            bucket: importedBucketInstance.importedBucket
        })
        s3ToSqsQueue.addDependency(importedBucketInstance);
        const SqsToLambda = new SqsToLambdaStack(this, props.SqsToLambdaStack, {
            queue: s3ToSqsQueue.queue,
            lambdaFunction: lambdaInstace.test_lambda
        })
        SqsToLambda.addDependency(lambdaInstace);
        SqsToLambda.addDependency(s3ToSqsQueue);
    }
}