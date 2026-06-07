async function rareBloodAgent(
  bloodGroup
) {

  const rareGroups = [
    "AB-",
    "O-",
    "Bombay",
  ];

  return {

    isRare:
      rareGroups.includes(
        bloodGroup
      ),

    escalationRequired:
      rareGroups.includes(
        bloodGroup
      ),

    network:
      rareGroups.includes(
        bloodGroup
      )
        ? "Rare Blood Network"
        : null,
  };
}

module.exports = {
  rareBloodAgent,
};