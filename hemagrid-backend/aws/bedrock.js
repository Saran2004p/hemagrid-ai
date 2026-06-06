import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
});

export async function analyzeRequest(request) {
  const prompt = `
You are HemaGrid AI.

Analyze this blood request.

Patient:
${JSON.stringify(request)}

Return:
1. Urgency Score (0-100)
2. Reason
3. Priority Level
`;

  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_MODEL,

    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),

    contentType: "application/json",
  });

  const response = await client.send(command);

  const result = JSON.parse(
    new TextDecoder().decode(response.body)
  );

  return result;
}