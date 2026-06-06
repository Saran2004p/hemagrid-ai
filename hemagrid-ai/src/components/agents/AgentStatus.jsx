import React from "react";

export default function AgentStatus() {
  const statuses = [
    "Urgency Agent",
    "Donor Agent",
    "Communication Agent",
    "Escalation Agent",
    "Learning Agent",
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-xl font-bold mb-6">
        Agent Status
      </h3>

      {statuses.map((agent) => (
        <div
          key={agent}
          className="flex justify-between mb-4"
        >
          <span>{agent}</span>

          <span className="text-green-600 font-semibold">
            Online
          </span>
        </div>
      ))}
    </div>
  );
}