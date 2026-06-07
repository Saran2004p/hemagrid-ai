const {
  forecastingAgent,
} = require(
  "./forecastingAgent"
);

async function predictiveShortageAgent() {

  const forecasts =
    await forecastingAgent();

  const shortages =
    forecasts
      .filter(
        item =>
          item.risk === "HIGH"
      )
      .map(item => ({

        bloodGroup:
          item.bloodGroup,

        risk:
          item.risk,

        recommendation:
          `Launch donor campaign for ${item.bloodGroup}`
      }));

  return {
    shortageDetected:
      shortages.length > 0,

    shortages,
  };
}

module.exports = {
  predictiveShortageAgent,
};