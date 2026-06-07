const {
  BedrockRuntimeClient,
  ConverseCommand,
} = require(
  "@aws-sdk/client-bedrock-runtime"
);

const client =
  new BedrockRuntimeClient({
    region:
      process.env.AWS_REGION,
  });

async function explainabilityAgent(
  request,
  urgency,
  donors
) {

  return {
    patient: request.patientName,

    urgencyReason:
      urgency.reason,

    selectedDonors:
      donors.slice(0, 3).map(
        donor => ({
          donorId:
            donor.donorId,

          donorName:
            donor.name,

          aiScore:
            donor.aiScore,

          responseProbability:
            donor.responseProbability,

          explanation:
            `
Selected because:

• Compatible blood group
• Available donor
• High response probability
• Good donation history
• Located in ${donor.city}
            `.trim()
        })
      )
  };
}

module.exports = {
  explainabilityAgent
};