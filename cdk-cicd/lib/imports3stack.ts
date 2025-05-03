import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export interface ImportBucketStackProps extends StackProps {
    bucketArn: string;
    importBucketStack: string;
}

export class ImportBucketStack extends Stack {
    public readonly importedBucket: s3.IBucket;

    constructor(scope: Construct, id: string, props: ImportBucketStackProps) {
        super(scope, id, props);

        this.importedBucket = s3.Bucket.fromBucketArn(
            this,
            props.importBucketStack,
            props.bucketArn
        );
    }
}
