async function donorReputationAgent(
  donor
) {

  let reputation = 50;

  reputation +=
    (donor.responses || 0) * 5;

  reputation -=
    (
      donor.ignoredRequests || 0
    ) * 2;

  reputation -=
    (
      donor.rejectedRequests || 0
    ) * 5;

  reputation +=
    (
      donor.successfulDonations || 0
    ) * 10;

  reputation =
    Math.max(
      0,
      Math.min(
        100,
        reputation
      )
    );

  return {
    ...donor,
    reputationScore:
      reputation
  };
}

module.exports = {
  donorReputationAgent
};