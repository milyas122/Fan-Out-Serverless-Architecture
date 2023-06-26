"use strict";
const {
  DynamoDBClient,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamodb_client = new DynamoDBClient({ region: "us-east-1" });
const ordersTable = process.env.ORDER_TABLE;

module.exports.handler = async (event) => {
  console.log("Message: digital order is processed");
  console.log("Event: ", event);
  const records = event.Records;
  const results = await processDigitalOrder(records);
  console.log("Results: ", results);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "digital order is processed",
        data: {},
      },
      null,
      2
    ),
  };
};

async function processDigitalOrder(records) {
  for (const message of records) {
    const { id } = JSON.parse(message.body);
    const input = {
      TableName: ordersTable,
      Key: marshall({ id, type: "digital" }),
      ExpressionAttributeNames: { "#ST": "status", "#RE": "remarks" },
      ExpressionAttributeValues: marshall({
        ":s": "InProgress",
        ":r": "digital order is being process",
      }),
      UpdateExpression: "SET #ST = :s, #RE = :r",
      ReturnValues: "ALL_NEW",
    };

    const command = new UpdateItemCommand(input);
    const response = await dynamodb_client.send(command);
    return response;
  }
}
