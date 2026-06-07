const {
  calculateDistance
} = require(
  "../services/calculateDistance"
);

async function geoSpatialAgent(
  request,
  donors
) {

  return donors.map(
    donor => ({

      ...donor,

      distanceKm:
        calculateDistance(
          request.latitude,
          request.longitude,
          donor.latitude,
          donor.longitude
        )
    })
  );
}

module.exports = {
  geoSpatialAgent
};