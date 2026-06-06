const admin = require('firebase-admin')

const sendPushNotification = async (tokens, request) => {
  if (!tokens?.length) return

  const message = {
    notification: {
      title: '🩸 BloodBridge Alert',
      body: `Urgent ${request.bloodType} blood needed in ${request.city}`,
    },
    tokens,
  }

  return admin.messaging().sendEachForMulticast(message)
}

module.exports = sendPushNotification