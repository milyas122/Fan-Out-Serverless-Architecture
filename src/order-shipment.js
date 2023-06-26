"use strict";

const {
  DynamoDBClient,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamodb_client = new DynamoDBClient({ region: "us-east-1" });
const ordersTable = process.env.ORDER_TABLE;

module.exports.handler = async (event) => {
  console.log("Event: ", event);
  const records = event.Records;
  const results = await processShipment(records);
  console.log("Results: ", results);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Physical Order is processed",
        data: event,
      },
      null,
      2
    ),
  };
};

async function processShipment(records) {
  for (const message of records) {
    const { id } = JSON.parse(message.body);
    const input = {
      TableName: ordersTable,
      Key: marshall({ id, type: "physical" }),
      ExpressionAttributeNames: {
        "#ST": "status",
        "#RE": "remarks",
        "#SA": "shipping_address",
      },
      ExpressionAttributeValues: marshall({
        ":s": "InProgress",
        ":r": "Physical order is being process",
        ":sa": "Hardcoded shipping address",
      }),
      UpdateExpression: "SET #ST = :s, #RE = :r, #SA = :sa",
      ReturnValues: "ALL_NEW",
    };

    const command = new UpdateItemCommand(input);
    const response = await dynamodb_client.send(command);
    return response;
  }
}
