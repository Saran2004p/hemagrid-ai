const {
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const {
  docClient,
} = require("../aws/dynamodb");

async function logEvent(
  agent,
  message
) {

  const event = {

    eventId:
      Date.now().toString(),

    timestamp:
      new Date().toISOString(),

    agent,
    message
  };

  await docClient.send(
    new PutCommand({

      TableName:
        "hemagrid-events",

      Item: event
    })
  );

  if (global.io) {

    global.io.emit(
      "new-event",
      event
    );
  }
}

module.exports = {
  logEvent,
};