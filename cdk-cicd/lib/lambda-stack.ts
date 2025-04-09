import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";


interface LambdaStackProps extends StackProps {
    stageName: string;
}

export class LambdaStack extends Stack{
    constructor(scope: Construct, id: string, props?: LambdaStackProps){
        super(scope, id, props);
       
        const test_lambda = new lambda.Function(this, 'myLambdaFunction101', {
            handler: 'test_function.handler',
            runtime: lambda.Runtime.PYTHON_3_9,
            code: lambda.Code.fromAsset('src/lambda'),
        });
    }
}