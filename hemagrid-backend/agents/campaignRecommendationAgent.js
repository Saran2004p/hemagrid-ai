const {
  predictiveShortageAgent,
} = require(
  "./predictiveShortageAgent"
);

async function campaignRecommendationAgent() {

  const shortageData =
    await predictiveShortageAgent();

  if (
    !shortageData.shortageDetected
  ) {

    return {
      campaignRequired:
        false,
    };
  }

  const campaigns =
    shortageData.shortages.map(
      shortage => ({

        bloodGroup:
          shortage.bloodGroup,

        priority:
          shortage.risk,

        targetCity:
          "Chennai",

        strategy:
          "Launch donor campaign",

        channels: [

          "SMS",

          "WhatsApp",

          "Push Notification"
        ]
      })
    );

  return {

    campaignRequired:
      true,

    campaigns
  };
}

module.exports = {
  campaignRecommendationAgent,
};