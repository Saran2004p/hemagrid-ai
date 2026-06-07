const {
  UpdateCommand,
} = require(
  "@aws-sdk/lib-dynamodb"
);

const {
  docClient,
} = require(
  "../aws/dynamodb"
);

async function donorMemoryAgent(
  donorId,
  accepted = true
) {

  await docClient.send(
    new UpdateCommand({

      TableName:
        "hemagrid-donors",

      Key: {
        donorId,
      },

      UpdateExpression: `
SET totalRequests =
  if_not_exists(
    totalRequests,
    :zero
  ) + :one,

responses =
  if_not_exists(
    responses,
    :zero
  ) + :response
`,

      ExpressionAttributeValues: {

        ":zero": 0,

        ":one": 1,

        ":response":
          accepted ? 1 : 0,
      },
    })
  );

  return {
    success: true,
  };
}

module.exports = {
  donorMemoryAgent,
};