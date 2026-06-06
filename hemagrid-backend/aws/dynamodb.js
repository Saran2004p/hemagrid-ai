import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const db = DynamoDBDocumentClient.from(client);

export async function saveRequest(data) {
  await db.send(
    new PutCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: data,
    })
  );
}

export async function getRequests() {
  const result = await db.send(
    new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE,
    })
  );

  return result.Items;
}