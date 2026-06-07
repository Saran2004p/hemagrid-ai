async function languageAgent(
  city
) {

  const languageMap = {

    Hyderabad:
      "Telugu",

    Chennai:
      "Tamil",

    Bangalore:
      "Kannada",

    Mumbai:
      "Hindi",

    Delhi:
      "Hindi",
  };

  return (
    languageMap[city] ||
    "English"
  );
}

module.exports = {
  languageAgent,
};