const {
  ScanCommand,
} = require(
  "@aws-sdk/lib-dynamodb"
);

const {
  docClient,
} = require(
  "../aws/dynamodb"
);

async function demandForecastAgent() {

  const result =
    await docClient.send(
      new ScanCommand({
        TableName:
          "hemagrid-learning",
      })
    );

  const records =
    result.Items || [];

  const demand = {};

  records.forEach((r) => {

    demand[r.bloodGroup] =
      (demand[r.bloodGroup] || 0) + 1;
  });

  const forecast =
    Object.entries(demand)
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .slice(0, 5);

  return {
    predictedDemand:
      forecast,
  };
}

module.exports = {
  demandForecastAgent,
};