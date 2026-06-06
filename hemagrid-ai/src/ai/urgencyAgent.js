export const analyzeUrgency = (request) => {
  if (request.urgency === "Critical") {
    return {
      level: "Critical",
      score: 95,
      reason: "Immediate blood requirement",
    };
  }

  return {
    level: "Normal",
    score: 55,
    reason: "Scheduled requirement",
  };
};