import React, {
  useState,
  useEffect
} from "react";

import AgentStatus from "../components/agents/AgentStatus";
import AgentTimeline from "../components/agents/AgentTimeline";

export default function CoordinationCenter() {

  const [stats, setStats] =
    useState(null);

  useEffect(() => {

    const loadStats =
      async () => {

        try {

          const response =
            await fetch(`${BASE_URL}/api/dashboard`);

          const data =
            await response.json();

          setStats(data);

        } catch (error) {

          console.error(error);
        }
      };

    loadStats();

  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-4xl font-bold mb-8">
        HemaGrid Command Center
      </h1>

      <AgentStatus />
      <AgentTimeline />
    </div>
  );
}