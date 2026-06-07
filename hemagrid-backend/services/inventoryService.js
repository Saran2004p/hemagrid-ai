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

async function getInventory() {

  const result =
    await docClient.send(
      new ScanCommand({
        TableName:
          "hemagrid-inventory"
      })
    );

  return result.Items || [];
}

module.exports = {
  getInventory
};