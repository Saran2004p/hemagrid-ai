const {
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const {
  docClient,
} = require("../aws/dynamodb");

async function learningAgent(
  data
) {

  await docClient.send(
    new PutCommand({
      TableName:
        "hemagrid-learning",

      Item: {

        learningId:
          Date.now().toString(),

        timestamp:
          new Date().toISOString(),

        bloodGroup:
          data.request.bloodGroup,

        city:
          data.request.city,

        urgency:
          data.urgency.priority,

        donorCount:
          data.donors.length,

        escalation:
          data.escalation.escalated,
      },
    })
  );

  return {
    learned: true,
  };
}

module.exports = {
  learningAgent,
};