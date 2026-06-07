const {
  getAnalytics
} = require(
  "../services/analyticsService"
);

async function forecastingAgent() {

  const analytics =
    await getAnalytics();

  const forecasts = [];

  for (
    const bloodGroup in analytics.bloodGroups
  ) {

    const count =
      analytics.bloodGroups[
        bloodGroup
      ];

    let risk = "LOW";

    if (count > 10)
      risk = "MEDIUM";

    if (count > 20)
      risk = "HIGH";

    forecasts.push({
      bloodGroup,
      requests: count,
      risk
    });
  }

  return forecasts;
}

module.exports = {
  forecastingAgent
};