async function resourceAllocationAgent(
  requests
) {

  const ranked =
    requests.sort(
      (a, b) => {

        const urgencyWeight = {

          CRITICAL: 4,
          HIGH: 3,
          MEDIUM: 2,
          LOW: 1
        };

        return (
          urgencyWeight[
            b.priority
          ] -
          urgencyWeight[
            a.priority
          ]
        );
      }
    );

  return {

    totalRequests:
      ranked.length,

    allocationPlan:
      ranked.map(
        (
          request,
          index
        ) => ({

          rank:
            index + 1,

          patient:
            request.patientName,

          bloodGroup:
            request.bloodGroup,

          priority:
            request.priority
        })
      )
  };
}

module.exports = {
  resourceAllocationAgent
};