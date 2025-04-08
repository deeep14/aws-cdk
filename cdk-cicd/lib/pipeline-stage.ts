import { StackProps, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaStack } from "./lambda-stack";

interface PipelineStageStackProps extends StackProps {
    LambdaStackStageName: string;
}

export class PipelineStage extends Stage{
    constructor(scope: Construct, id: string, props: PipelineStageStackProps){
        super(scope, id, props);
        new LambdaStack(this, 'myNewLambdaStack010', {
            stageName: props.LambdaStackStageName
        })
    }
}