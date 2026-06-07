const {
  sendAlert,
} = require("../aws/sns");

async function alertDonors(
  request,
  donors
) {
  for (const donor of donors) {
    await sendAlert(
      `Blood Needed:
${request.patientName}
${request.bloodGroup}`
    );
  }

  return true;
}

module.exports = {
  alertDonors,
};