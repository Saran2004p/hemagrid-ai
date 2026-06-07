export default function AgentStatus() {
  const agents = [
    "Coordinator",
    "Urgency",
    "Donor Intelligence",
    "Communication",
    "Escalation",
    "Learning",
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-bold mb-4">
        Agent Status
      </h2>

      {agents.map((agent) => (
        <div
          key={agent}
          className="flex justify-between py-2"
        >
          <span>{agent} Agent</span>

          <span className="text-green-600 font-bold">
            ACTIVE
          </span>
        </div>
      ))}
    </div>
  );
}