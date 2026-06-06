import React from "react";
import AgentActivityFeed from "../components/agents/AgentActivityFeed";
import AgentStatus from "../components/agents/AgentStatus";

export default function CoordinationCenter() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Coordination Center
        </h1>

        <p className="text-gray-600">
          Real-time AI care coordination dashboard
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AgentActivityFeed />
        </div>

        <div>
          <AgentStatus />
        </div>
      </div>
    </div>
  );
}