# rekommend-api

This project runs serverless making use of the [AWS Serverless Application Model (SAM)](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)

## Requirements

* AWS account
* Access to configure IAM permissions
* AWS CLI
* AWS SAM CLI

## Quick start

**Packaging**

Run `aws cloudformation package --template-file template.yaml --s3-bucket {bucket} --output-template-file {output}.yaml`

{bucket} - The name of an existing s3 bucket that you want to store your you src files in

{output} - The name of the file output by the packaging function

**Deploying**

Run `aws cloudformation deploy --template-file {output}.yaml --stack-name {stack} --capabilities CAPABILITY_IAM`

{output} - The name of the file output by the packing command

{stack} - The name of the cloudformation stack

## Running locally

Run `sam local start-api`

*This project isn't currently configured to run locally and will return an error when the endpoint is called*


