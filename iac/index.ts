import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Create an S3 bucket (V2) 
const bucket = new aws.s3.BucketV2("temp-image-bucket", {
    forceDestroy: true, // Allow bucket to be destroyed even if it contains objects
});

//ownership controls
const ownershipControls = new aws.s3.BucketOwnershipControls("bucket-ownership-controls", {
    bucket: bucket.id,
    rule: {
        objectOwnership: "BucketOwnerPreferred",
    },
});

// Block public access to the bucket
const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("bucket-public-access-block", {
    bucket: bucket.id,
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true,
});

// Configure CORS for the V2 bucket
const bucketCors = new aws.s3.BucketCorsConfigurationV2("bucket-cors", {
    bucket: bucket.id,
    corsRules: [{
        allowedHeaders: ["*"],
        allowedMethods: ["PUT", "POST", "GET"],
        allowedOrigins: ["*"], // Restrict in production
        exposeHeaders: ["ETag"],
        maxAgeSeconds: 3000,
    }],
});

// Configure lifecycle rules for automatic deletion after 1 minute
const lifecycleConfig = new aws.s3.BucketLifecycleConfigurationV2("bucket-lifecycle", {
    bucket: bucket.id,
    rules: [{
        id: "delete-after-1-day",
        status: "Enabled",
        expiration: {
            days: 1, // Minimum value allowed by S3
        },
        // Note: S3 doesn't support expiration in minutes directly
        // For < 1 day expiration, you'll need Lambda + CloudWatch Events
    }],
});

// Create IAM role for Lambda
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

// Attach policy for Lambda to access S3
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
                `${arn}/*`,
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

// Export the bucket name and URL
export const bucketName = bucket.id;
export const bucketUrl = pulumi.interpolate`https://${bucket.bucketRegionalDomainName}`;
export const lambdaRoleArn = lambdaRole.arn;