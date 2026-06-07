const {
  BedrockRuntimeClient,
  ConverseCommand,
} = require(
  "@aws-sdk/client-bedrock-runtime"
);

const {
  languageAgent,
} = require(
  "./languageAgent"
);

const client =
  new BedrockRuntimeClient({
    region:
      process.env.AWS_REGION,
  });

async function communicationAgent(
  request,
  donor
) {

  const language =
    await languageAgent(
      request.city
    );

  const command =
    new ConverseCommand({

      modelId:
        process.env.BEDROCK_MODEL_ARN,

      messages: [
        {
          role: "user",

          content: [
            {
              text: `
Generate a professional emergency blood donation request.

Language:
${language}

Donor:
${donor.name}

Patient:
${request.patientName}

Blood Group:
${request.bloodGroup}

City:
${request.city}

Units Required:
${request.units}

Priority:
${request.urgency || "HIGH"}

Requirements:
- Keep under 120 words
- Be respectful
- Mention urgency
- Ask donor to respond immediately if available
`
            }
          ]
        }
      ]
    });

  const response =
    await client.send(
      command
    );

  return response.output
    .message
    .content[0]
    .text;
}

module.exports = {
  communicationAgent,
};