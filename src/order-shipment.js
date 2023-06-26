"use strict";

module.exports.handler = async (event) => {
  console.log("Event: ", event);

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
