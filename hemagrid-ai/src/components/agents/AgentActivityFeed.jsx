import React from "react";
import mockAgentEvents from "../../data/mockAgentEvents";

export default function AgentActivityFeed() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="text-xl font-bold mb-6">
        Live AI Coordination Timeline
      </h2>

      <div className="space-y-4">
        {mockAgentEvents.map((event) => (
          <div
            key={event.id}
            className="border-l-4 border-red-500 pl-4 py-3"
          >
            <p className="font-semibold">
              {event.agent}
            </p>

            <p className="text-gray-600">
              {event.action}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              {event.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}