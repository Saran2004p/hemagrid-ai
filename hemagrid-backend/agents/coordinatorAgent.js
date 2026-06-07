const {
  analyzeUrgency,
} = require("../aws/bedrock");

const {
  getCompatibleDonors,
} = require(
  "../services/matchDonors"
);

const {
  sendAlert,
} = require("../aws/sns");

const {
  escalationAgent,
} = require(
  "./escalationAgent"
);

const {
  learningAgent,
} = require(
  "./learningAgent"
);

const {
  communicationAgent,
} = require(
  "./communicationAgent"
);

const {
  rareBloodAgent,
} = require(
  "./rareBloodAgent"
);

const {
  donorMemoryAgent,
} = require(
  "./donorMemoryAgent"
);

const {
  logEvent,
} = require(
  "../services/eventLogger"
);

const {
  explainabilityAgent,
} = require(
  "./explainabilityAgent"
);

const {
  hospitalInventoryAgent,
} = require(
  "./hospitalInventoryAgent"
);

const {
  emergencyRoutingAgent,
} = require(
  "./emergencyRoutingAgent"
);

const {
  predictiveShortageAgent,
} = require(
  "./predictiveShortageAgent"
);

const {
  multilingualCommunicationAgent,
} = require(
  "./multilingualCommunicationAgent"
);

const {
  voiceCommunicationAgent,
} = require(
  "./voiceCommunicationAgent"
);

async function coordinatorAgent(
  request
) {

  console.log(
    "Coordinator Agent Started"
  );

  // ===================
  // URGENCY AGENT
  // ===================

  const urgency =
    await analyzeUrgency(
      request
    );

  await logEvent(
    "Urgency Agent",
    `Priority ${urgency.priority}`
  );

  console.log(
    "Urgency Agent Completed"
  );

  // ===================
  // HOSPITAL INVENTORY AGENT
  // ===================

  const inventory =
    await hospitalInventoryAgent(
      request
    );

  await logEvent(
    "Hospital Inventory Agent",
    JSON.stringify(
      inventory
    )
  );

  // ===================
// PREDICTIVE SHORTAGE
// ===================

const shortagePrediction =
  await predictiveShortageAgent();

await logEvent(
  "Predictive Shortage Agent",
  JSON.stringify(
    shortagePrediction
  )
);

  // ===================
  // RARE BLOOD AGENT
  // ===================

  const rareBlood =
    await rareBloodAgent(
      request.bloodGroup
    );

  await logEvent(
    "Rare Blood Agent",
    JSON.stringify(
      rareBlood
    )
  );

  // ===================
  // DONOR INTELLIGENCE
  // ===================

  const donors =
    await getCompatibleDonors(
      request
    );

  await logEvent(
    "Donor Intelligence Agent",
    `${donors.length} donors ranked`
  );

  console.log(
    "Donor Agent Completed"
  );

  // ===================
  // EMERGENCY ROUTING
  // ===================

  const routing =
    await emergencyRoutingAgent(
      request,
      donors,
      inventory.hospitals || []
    );

  await logEvent(
    "Emergency Routing Agent",
    JSON.stringify(
      routing
    )
  );

  // ===================
  // DONOR MEMORY
  // ===================

  if (donors.length > 0) {

    await donorMemoryAgent(
      donors[0].donorId,
      true
    );
  }

  // ===================
  // COMMUNICATION
  // ===================

  if (donors.length > 0) {

    for (
      const donor of donors
    ) {

      const message =
  await communicationAgent(
    request,
    donor
  );

const localized =
  await multilingualCommunicationAgent(
    donor,
    message
  );

  await sendAlert(
  localized.message
);

const voiceMessage =
  await voiceCommunicationAgent(
    request,
    donor
  );

await logEvent(
  "Voice Agent",
  `Voice script generated for ${donor.name}`
);

await logEvent(
  "Multilingual Agent",
  `Message sent in ${localized.language}`
);
    }

    await logEvent(
      "Communication Agent",
      "SNS alerts sent"
    );

    console.log(
      "Communication Agent Completed"
    );
  }

  // ===================
  // ESCALATION
  // ===================

  const escalation =
    await escalationAgent(
      request,
      donors
    );

  await logEvent(
    "Escalation Agent",
    JSON.stringify(
      escalation
    )
  );

  console.log(
    "Escalation Agent Completed"
  );

  // ===================
  // LEARNING
  // ===================

  await learningAgent({
    request,
    urgency,
    donors,
    escalation,
  });

  await logEvent(
    "Learning Agent",
    "Knowledge updated"
  );

  console.log(
    "Learning Agent Completed"
  );

  // ===================
  // EXPLAINABILITY
  // ===================

  const explanation =
    await explainabilityAgent(
      request,
      urgency,
      donors
    );

  await logEvent(
    "Explainability Agent",
    "Decision explanation generated"
  );

  // ===================
  // FINAL RESPONSE
  // ===================

  return {

  urgency,

  rareBlood,

  inventory,

  shortagePrediction,

  donors,

  routing,

  escalation,

  explanation,

  workflow:
    "COMPLETED",
};
}

module.exports = {
  coordinatorAgent,
};