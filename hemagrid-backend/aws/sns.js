import {
  SNSClient,
  PublishCommand,
} from "@aws-sdk/client-sns";

const sns = new SNSClient({
  region: process.env.AWS_REGION,
});

export async function notifyDonors(message) {
  await sns.send(
    new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: message,
    })
  );
}