import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const bucket = new aws.s3.BucketV2("temp-image-bucket", {
    forceDestroy: true, 
});

const ownershipControls = new aws.s3.BucketOwnershipControls("bucket-ownership-controls", {
    bucket: bucket.id,
    rule: {
        objectOwnership: "BucketOwnerPreferred",
    },
});

const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("bucket-public-access-block", {
    bucket: bucket.id,
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true,
});

const bucketCors = new aws.s3.BucketCorsConfigurationV2("bucket-cors", {
    bucket: bucket.id,
    corsRules: [{
        allowedHeaders: ["*"],
        allowedMethods: ["PUT", "POST", "GET"],
        allowedOrigins: ["*"], // TODO: Restrict in production
        exposeHeaders: ["ETag"],
        maxAgeSeconds: 3000,
    }],
});


const lifecycleConfig = new aws.s3.BucketLifecycleConfigurationV2("bucket-lifecycle", {
    bucket: bucket.id,
    rules: [{
        id: "delete-after-1-day",
        status: "Enabled",
        expiration: {
            days: 1, // Minimum value allowed by S3
        },
    }],
});


const lambdaRole = new aws.iam.Role("lambda-role", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
                Service: "lambda.amazonaws.com",
            },
        }],
    }),
});


const lambdaS3Policy = new aws.iam.RolePolicy("lambda-s3-policy", {
    role: lambdaRole.id,
    policy: bucket.arn.apply(arn => JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            Effect: "Allow",
            Resource: [
                `${arn}/*`, //dynamic bucket ARN
            ]
        }, {
            Action: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            Effect: "Allow",
            Resource: "arn:aws:logs:*:*:*"
        }]
    }))
});


export const bucketName = bucket.id;
export const bucketUrl = pulumi.interpolate`https://${bucket.bucketRegionalDomainName}`;
export const lambdaRoleArn = lambdaRole.arn;