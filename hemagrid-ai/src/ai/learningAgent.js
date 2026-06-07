export function learnFromRequest(
  request,
  outcome
) {
  return {
    city: request.city,
    bloodGroup: request.bloodGroup,
    success: outcome,
    timestamp: new Date()
  };
}