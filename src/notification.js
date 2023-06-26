"use strict";

module.exports.handler = async (event) => {
  console.log("Event: ", event);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "notification is sent",
        data: event,
      },
      null,
      2
    ),
  };
};
