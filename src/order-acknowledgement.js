"use strict";

const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const dynamodb_client = new DynamoDBClient({ region: "us-east-1" });
const sns_client = new SNSClient({ region: "us-east-1" });
const ordersTable = process.env.ORDER_TABLE;
const topicArn = process.env.SNS_TOPIC_ARN;

module.exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  const id = uuidv4().toString();
  await createOrder({ id, ...data });
  const sns_command = new PublishCommand({
    TopicArn: topicArn,
    Message: JSON.stringify({ id, ...data }),
    MessageAttributes: {
      orderType: {
        DataType: "String",
        StringValue: data.orderType,
      },
    },
  });
  const sns_response = await sns_client.send(sns_command);
  console.log("SNS Response: ", sns_response);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "success",
        data: {},
      },
      null,
      2
    ),
  };
};

async function createOrder({ id, productName, quantity, price, orderType }) {
  const total = price * quantity;
  const params = {
    TableName: ordersTable,
    Item: marshall({
      id,
      type: orderType,
      status: "pending",
      created_at: moment().format(),
      updated_at: moment().format(),
      productName,
      quantity,
      total,
    }),
  };
  const command = new PutItemCommand(params);
  await dynamodb_client.send(command);
}
