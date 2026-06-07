const {
  logEvent,
} = require("../services/eventLogger");

export async function coordinateRequest(request) {
  return {
    nextStep: "URGENCY_ANALYSIS",
    status: "PROCESSING",
    timestamp: new Date().toISOString(),
  };
}