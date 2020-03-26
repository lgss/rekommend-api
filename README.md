# rekommend-api

## Requirements

* AWS CLI
* AWS SAM CLI

## Quick start

*Packaging*
Run `aws cloudformation package --template-file template.yaml --s3-bucket {bucket} --output-template-file {output}.yaml`

{bucket} - The name of your s3 bucket that you want to store your you src files in
{output} - The name of the file output by the packaging function

*Deploying*

Run `aws cloudformation deploy --template-file {output}.yaml --stack-name {stack} --capabilities CAPABILITY_IAM`

{output} - The name of the file output by the packing command
{stack} - The name of the cloudformation stack


