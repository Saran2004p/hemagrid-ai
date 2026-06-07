async function responsePredictionAgent(
  donor
) {

  const responseRate =
    donor.responseRate || 10;

  const reliability =
    donor.reliabilityScore || 10;

  const donationFactor =
    Math.min(
      donor.lastDonationDays / 10,
      20
    );

  const probability =
    Math.min(
      (
        responseRate +
        reliability +
        donationFactor
      ) / 50,
      0.99
    );

  const expectedResponseMinutes =
    Math.max(
      5,
      Math.round(
        60 - probability * 40
      )
    );

  return {
    responseProbability:
      Number(
        probability.toFixed(2)
      ),

    expectedResponseMinutes,
  };
}

module.exports = {
  responsePredictionAgent,
};