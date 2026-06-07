const {
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const {
  docClient,
} = require("../aws/dynamodb");

async function generateInsights() {

  const result =
    await docClient.send(
      new ScanCommand({
        TableName:
          "hemagrid-learning",
      })
    );

  const records =
    result.Items || [];

  const bloodGroups = {};

  records.forEach((r) => {

    if (!r.bloodGroup) return;

    bloodGroups[r.bloodGroup] =
      (bloodGroups[r.bloodGroup] || 0) + 1;
  });

  const hardestBloodGroup =
    Object.entries(
      bloodGroups
    ).sort(
      (a, b) => b[1] - a[1]
    )[0];

  return {
    totalCases:
      records.length,

    bloodGroups,

    shortagePrediction:
      hardestBloodGroup
        ? hardestBloodGroup[0]
        : null,
  };
}

module.exports = {
  generateInsights,
};