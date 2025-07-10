import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as eventSources from 'aws-cdk-lib/aws-lambda-event-sources';

export interface SqsToLambdaStackProps extends StackProps {
  queue: sqs.IQueue;
  lambdaFunction: lambda.IFunction;
}

export class SqsToLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: SqsToLambdaStackProps) {
    super(scope, id, props);

    const eventSource = new eventSources.SqsEventSource(props.queue, {
      batchSize: 1,
    });

    props.lambdaFunction.addEventSource(eventSource);
  }
}
