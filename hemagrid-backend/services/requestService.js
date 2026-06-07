const crypto = require("crypto");

const {
  db,
  PutCommand,
} = require("../aws/dynamodb");

async function createRequest(data) {
  const requestId =
    "REQ-" +
    crypto.randomBytes(4).toString("hex");

  const item = {
    requestId,
    ...data,
    createdAt: new Date().toISOString(),
  };

  await db.send(
    new PutCommand({
      TableName:
        process.env.DYNAMODB_TABLE,
      Item: item,
    })
  );

  return item;
}

module.exports = {
  createRequest,
};