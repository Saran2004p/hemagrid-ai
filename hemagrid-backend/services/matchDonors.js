const {
  donorIntelligenceAgent,
} = require(
  "../agents/donorIntelligenceAgent"
);

const {
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const {
  docClient,
} = require("../aws/dynamodb");

async function getCompatibleDonors(
  request
) {
  const result =
    await docClient.send(
      new ScanCommand({
        TableName:
          "hemagrid-donors",
      })
    );

  const donors =
    result.Items || [];

  const matches = donors
    .filter(
      (d) =>
        d.bloodGroup ===
          request.bloodGroup &&
        d.city === request.city &&
        d.available === true
    )
    .map((d) => {
      const matchScore =
        50 + // blood match
        30 + // availability
        Math.min(
          d.lastDonationDays *
            0.1,
          20
        );

      return {
        ...d,
        matchScore:
          Math.round(
            matchScore
          ),
        reason: `
Blood Group Match
Same City
Available
${d.lastDonationDays} days since donation
        `.trim(),
      };
    })
    .sort(
      (a, b) =>
        b.matchScore -
        a.matchScore
    );

  const rankedDonors =
  await donorIntelligenceAgent(
    request,
    matches
  );

return rankedDonors;
}

module.exports = {
  getCompatibleDonors,
};