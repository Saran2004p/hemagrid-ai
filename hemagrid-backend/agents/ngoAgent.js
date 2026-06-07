async function ngoAgent(
  bloodGroup,
  city
) {

  const ngoNetwork = {

    Hyderabad: [
      {
        name:
          "Blood Warriors",
        contact:
          "+91-9000000001",
      },
      {
        name:
          "Red Cross Hyderabad",
        contact:
          "+91-9000000002",
      },
    ],

    Chennai: [
      {
        name:
          "Blood Warriors Chennai",
        contact:
          "+91-9000000003",
      },
    ],
  };

  return (
    ngoNetwork[city] || []
  );
}

module.exports = {
  ngoAgent,
};