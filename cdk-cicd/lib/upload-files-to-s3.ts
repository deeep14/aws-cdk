import { Stack, StackProps } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3"
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from "constructs";
import * as path from 'path';

interface UploadFilesToS3StackProps extends StackProps {
    BucketLogicalId: string;
    BucketName: string;
}

export class UploadToS3Stack extends Stack {
    constructor(scope: Construct, id: string, props: UploadFilesToS3StackProps){
        super(scope, id, props);
        const bucket = s3.Bucket.fromBucketName(this, props.BucketLogicalId, props.BucketName);
        new s3deploy.BucketDeployment(this, 'UploadFiles', {
            destinationBucket: bucket,
            sources: [s3deploy.Source.asset(path.join(__dirname, '../s3-files'))],
          });
    }
}