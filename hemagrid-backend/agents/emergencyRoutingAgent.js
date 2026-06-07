const {
  calculateDistance,
} = require(
  "../services/calculateDistance"
);

async function emergencyRoutingAgent(
  request,
  donors,
  hospitals
) {

  if (
    donors.length === 0
  ) {

    return {
      routeAvailable:
        false,
    };
  }

  const donor =
    donors[0];

  const nearestHospital =
    hospitals.length > 0
      ? hospitals[0]
      : null;

  const donorDistance =
    calculateDistance(
      request.latitude,
      request.longitude,
      donor.latitude,
      donor.longitude
    );

  const etaMinutes =
    Math.round(
      donorDistance * 2
    );

  return {

    routeAvailable:
      true,

    donor:

    {
      donorId:
        donor.donorId,

      donorName:
        donor.name,
    },

    hospital:
      nearestHospital,

    donorDistanceKm:
      Number(
        donorDistance.toFixed(
          2
        )
      ),

    estimatedArrivalMinutes:
      etaMinutes,
  };
}

module.exports = {
  emergencyRoutingAgent,
};