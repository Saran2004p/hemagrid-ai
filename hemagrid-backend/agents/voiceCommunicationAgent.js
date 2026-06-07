async function voiceCommunicationAgent(
  request,
  donor
) {

  const script = `
Hello ${donor.name}.

An urgent blood donation request
has been received.

Patient requires
${request.bloodGroup} blood.

Location:
${request.city}

Please respond immediately
if you are available.

Thank you.
`;

  return {
    script,
    channel: "VOICE"
  };
}

module.exports = {
  voiceCommunicationAgent
};