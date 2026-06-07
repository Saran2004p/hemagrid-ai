import React from "react";
import AgentCard from "../components/agents/AgentCard";
import { Brain, Users, MessageSquare, AlertTriangle, GraduationCap } from "lucide-react";


const agents = [
  {
    title: "Urgency Agent",
    icon: Brain,
    description:
      "Analyzes incoming requests and predicts severity using AI.",
    status: "Active",
  },
  {
    title: "Donor Agent",
    icon: Users,
    description:
      "Ranks compatible donors based on availability, distance and response probability.",
    status: "Active",
  },
  {
    title: "Communication Agent",
    icon: MessageSquare,
    description:
      "Contacts donors through multilingual personalized communication.",
    status: "Active",
  },
  {
    title: "Escalation Agent",
    icon: AlertTriangle,
    description:
      "Expands outreach automatically if requests remain unresolved.",
    status: "Monitoring",
  },
  {
    title: "Learning Agent",
    icon: GraduationCap,
    description:
      "Learns from previous interactions and improves matching quality.",
    status: "Learning",
  },
];

export default function AIAgents() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-4xl font-bold mb-2">
        HemaGrid AI Agent Network
      </h1>

      <p className="text-gray-600 mb-8">
        Autonomous agents coordinating blood support operations.
      </p>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.title} {...agent} />
        ))}
      </div>
    </div>
  );
}