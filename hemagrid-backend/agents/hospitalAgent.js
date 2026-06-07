async function hospitalAgent(
  bloodGroup,
  city
) {

  const hospitals = {

    Hyderabad: [
      {
        name:
          "Apollo Hospitals",

        bloodGroup,

        availableUnits:
          12,
      },

      {
        name:
          "Yashoda Hospitals",

        bloodGroup,

        availableUnits:
          8,
      },
    ],

    Chennai: [
      {
        name:
          "Apollo Chennai",

        bloodGroup,

        availableUnits:
          10,
      },
    ],
  };

  return (
    hospitals[city] || []
  );
}

module.exports = {
  hospitalAgent,
};