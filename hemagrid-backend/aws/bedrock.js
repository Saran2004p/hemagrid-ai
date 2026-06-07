const {
  BedrockRuntimeClient,
  ConverseCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
});

async function analyzeUrgency(request) {
  const command = new ConverseCommand({
    modelId: process.env.BEDROCK_MODEL_ARN,

    messages: [
      {
        role: "user",
        content: [
          {
            text: `
You are HemaGrid AI.

Analyze this blood request:

${JSON.stringify(request)}

Urgency Scoring Rules:

CRITICAL:
- Score between 90 and 100
- Life-threatening emergency
- Required within 6 hours

HIGH:
- Score between 70 and 89
- Required within 24 hours

MEDIUM:
- Score between 40 and 69
- Required within 2-3 days

LOW:
- Score between 0 and 39
- Planned requirement

IMPORTANT:
The urgencyScore MUST match the priority.

Examples:

{
  "urgencyScore": 95,
  "priority": "CRITICAL",
  "reason": "Immediate life-saving requirement."
}

{
  "urgencyScore": 80,
  "priority": "HIGH",
  "reason": "Urgent blood requirement within 24 hours."
}

{
  "urgencyScore": 55,
  "priority": "MEDIUM",
  "reason": "Blood required in coming days."
}

{
  "urgencyScore": 20,
  "priority": "LOW",
  "reason": "Non-emergency planned requirement."
}

Return ONLY valid JSON.

{
  "urgencyScore": number,
  "priority": "CRITICAL|HIGH|MEDIUM|LOW",
  "reason": "short reason"
}
`,
          },
        ],
      },
    ],
  });

  const response = await client.send(command);

  const text =
  response.output.message.content[0].text;

const cleaned = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const result = JSON.parse(cleaned);

if (
  result.priority === "CRITICAL" &&
  result.urgencyScore < 90
) {
  result.urgencyScore = 95;
}

if (
  result.priority === "HIGH" &&
  result.urgencyScore < 70
) {
  result.urgencyScore = 80;
}

if (
  result.priority === "MEDIUM" &&
  result.urgencyScore < 40
) {
  result.urgencyScore = 55;
}

if (
  result.priority === "LOW" &&
  result.urgencyScore > 39
) {
  result.urgencyScore = 20;
}

return result;
}

module.exports = {
  analyzeUrgency,
};