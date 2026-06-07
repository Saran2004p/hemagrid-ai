function generateExplanation(
  donor
) {

  return {

    donorId:
      donor.donorId,

    donorName:
      donor.name,

    confidence:
      donor.aiScore,

    reasons: [

      "Blood Group Match",

      donor.city
        ? "Same City"
        : "Nearby City",

      donor.available
        ? "Available Now"
        : "Availability Unknown",

      `Response Rate ${donor.responseRate || 0}%`,

      `Reliability Score ${donor.reliabilityScore || 0}`,

      `${donor.lastDonationDays} days since donation`
    ],

    responseProbability:
      donor.responseProbability,

    expectedResponseMinutes:
      donor.expectedResponseMinutes
  };
}

module.exports = {
  generateExplanation
};