import React from "react";
import mockDonors from "../data/mockDonors";

export default function Explainability() {
  const donor = mockDonors[0];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-4xl font-bold mb-8">
        AI Explainability Center
      </h1>

      <div className="bg-white rounded-2xl p-8 shadow">
        <h2 className="text-2xl font-semibold mb-6">
          Why was {donor.name} selected?
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Blood Match</span>
            <span>100%</span>
          </div>

          <div className="flex justify-between">
            <span>Distance</span>
            <span>{donor.distance}</span>
          </div>

          <div className="flex justify-between">
            <span>Response Probability</span>
            <span>{donor.responseProbability}%</span>
          </div>

          <div className="flex justify-between">
            <span>Reliability</span>
            <span>{donor.reliability}/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}