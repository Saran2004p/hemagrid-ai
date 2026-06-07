const {
  ScanCommand
} = require(
  "@aws-sdk/lib-dynamodb"
);

const {
  docClient
} = require(
  "../aws/dynamodb"
);

async function getLearningData() {

  const result =
    await docClient.send(
      new ScanCommand({
        TableName:
          "hemagrid-learning"
      })
    );

  return result.Items || [];
}

module.exports = {
  getLearningData
};