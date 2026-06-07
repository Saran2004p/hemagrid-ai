const {
  responsePredictionAgent,
} = require(
  "./responsePredictionAgent"
);

const {
  geoSpatialAgent,
} = require(
  "./geoSpatialAgent"
);

const {
  donorReputationAgent,
} = require(
  "./donorReputationAgent"
);

async function donorIntelligenceAgent(
  request,
  donors
) {

  // Calculate donor distance
  donors =
    await geoSpatialAgent(
      request,
      donors
    );

  const ranked =
    await Promise.all(

      donors.map(
        async (donor) => {

          // Calculate reputation
          const donorWithReputation =
            await donorReputationAgent(
              donor
            );

          let score = 0;

          // Blood Match
          score += 40;

          // Availability
          if (
            donor.available
          ) {
            score += 25;
          }

          // Recovery Period
          score += Math.min(
            donor.lastDonationDays * 0.15,
            20
          );

          // Historical Response Rate
          score +=
            donor.responseRate || 0;

          // Reputation Score
          score +=
            donorWithReputation.reputationScore || 0;

          // Distance Scoring
          if (
            donor.distanceKm < 5
          ) {

            score += 25;

          } else if (
            donor.distanceKm < 10
          ) {

            score += 15;

          } else {

            score += 5;
          }

          // AI Prediction
          const prediction =
            await responsePredictionAgent(
              donorWithReputation
            );

          return {

            ...donorWithReputation,

            aiScore:
              Math.round(
                score
              ),

            distanceKm:
              Number(
                donor.distanceKm
                  .toFixed(2)
              ),

            responseProbability:
              prediction.responseProbability,

            expectedResponseMinutes:
              prediction.expectedResponseMinutes,
          };
        }
      )
    );

  return ranked.sort(
    (a, b) =>
      b.aiScore -
      a.aiScore
  );
}

module.exports = {
  donorIntelligenceAgent,
};