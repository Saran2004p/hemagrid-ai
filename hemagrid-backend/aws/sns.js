const {
  SNSClient,
  PublishCommand,
} = require("@aws-sdk/client-sns");

const sns = new SNSClient({
  region: process.env.AWS_REGION,
});

async function sendAlert(message) {
  return sns.send(
    new PublishCommand({
      TopicArn:
        process.env.SNS_TOPIC_ARN,
      Message: message,
    })
  );
}

module.exports = {
  sendAlert,
};