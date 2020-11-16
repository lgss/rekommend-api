#!/bin/bash

helpFunction()
{
   echo ""
   echo "Usage: $0 -s stackName [-p param=value;param2=value] [-l profileName] [-r regionName]"
   echo -e "\t-s Stack name"
   echo -e "\t-l The name of the local AWS profile to use"
   echo -e "\t-p Values passed as --parameter-overrides to CloudFormation"
   echo -e "\t-r The name of the AWS region to use"
   exit 1 # Exit script after printing help
}

profile=''
parameterOverrides=''

while getopts "p:l:r:s:" opt
do
   case "$opt" in
      l ) profile="--profile $OPTARG" ;;
      p ) parameterOverrides="--parameter-overrides $OPTARG" ;;
      r ) region="--region $OPTARG" ;;
      s ) stackName="$OPTARG" ;;
      ? ) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

if [ -z "$stackName" ] 
then
   echo "Some or all of the parameters are empty";
   helpFunction
fi

sam package --template-file template.yaml --output-template-file packaged-template.yaml --resolve-s3 --s3-prefix rekommend $profile $region
aws cloudformation deploy --template-file packaged-template.yaml --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND --stack-name $stackName $profile $region $parameterOverrides