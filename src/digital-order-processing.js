"use strict";

module.exports.handler = async (event) => {
  console.log("Message: digital order is processed");
  console.log("Event: ", event);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "digital order is processed",
        data: event,
      },
      null,
      2
    ),
  };
};
