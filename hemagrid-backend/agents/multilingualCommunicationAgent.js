async function multilingualCommunicationAgent(
  donor,
  message
) {

  const language =
    donor.language ||
    "English";

  const templates = {

    English:
      message,

    Tamil:
      `அவசர இரத்த தான கோரிக்கை.
${message}`,

    Hindi:
      `आपातकालीन रक्तदान अनुरोध।
${message}`,

    Telugu:
      `అత్యవసర రక్తదాన అభ్యర్థన.
${message}`,

    Kannada:
      `ತುರ್ತು ರಕ್ತದಾನ ವಿನಂತಿ.
${message}`,

    Malayalam:
      `അത്യാവശ്യ രക്തദാന അഭ്യർത്ഥന.
${message}`
  };

  return {

    language,

    message:
      templates[
        language
      ] || message
  };
}

module.exports = {
  multilingualCommunicationAgent,
};