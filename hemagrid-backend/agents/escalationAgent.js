const {
  searchNearbyCities,
} = require(
  "../services/searchNearbyCities"
);

const {
  hospitalAgent,
} = require(
  "./hospitalAgent"
);

const {
  ngoAgent,
} = require(
  "./ngoAgent"
);

async function escalationAgent(
  request,
  donors
) {

  if (donors.length >= 3) {
    return {
      escalated: false,
      level: 0,
      action: null,
      message:
        "Sufficient donors found",
    };
  }

  if (donors.length > 0) {

    const nearbyCities =
      await searchNearbyCities(
        request.city
      );

    return {
      escalated: true,
      level: 1,
      nearbyCities,
      action:
        "Expand search radius",
      message:
        "Few donors available",
    };
  }

  const hospitals =
    await hospitalAgent(
      request.bloodGroup,
      request.city
    );

  const ngos =
    await ngoAgent(
      request.bloodGroup,
      request.city
    );

  return {
  escalated: true,

  level: 3,

  hospitals,

  ngos,

  action:
    "Hospital and NGO escalation",

  message:
    "No compatible donors found",
};
}

module.exports = {
  escalationAgent,
};