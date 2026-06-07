const { PutCommand } =
  require("@aws-sdk/lib-dynamodb");

const { docClient } =
  require("../aws/dynamodb");

async function saveLearning(data) {

  await docClient.send(
    new PutCommand({
      TableName:
        "hemagrid-learning",

      Item: {

        learningId:
          Date.now().toString(),

        bloodGroup:
          data.request.bloodGroup,

        city:
          data.request.city,

        urgency:
          data.urgency.priority,

        donorCount:
          data.donors.length,

        createdAt:
          new Date().toISOString()
      }
    })
  );
}

module.exports = {
  saveLearning
};