# Fanout Pattern

## Installation

- Download and install [Node Js](https://nodejs.org/en/)
- Download and run the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) MSI installer

Install the serverless CLI via NPM:

```bash
npm install -g serverless
```

Once AWS CLI is installed, configure AWS CLI with AWS Access Key ID and AWS Secret Access Key.

```bash
 aws configure
```

Install node modules via NPM

```bash
npm i
```

## After Successful Installation uses the below to deploy serverless code to AWS.

```bash
serverless deploy --stage dev
```
