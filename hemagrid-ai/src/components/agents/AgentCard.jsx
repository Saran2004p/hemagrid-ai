import React from "react";

export default function AgentCard({
  title,
  description,
  status,
  icon: Icon,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <Icon className="w-10 h-10 text-red-500 mb-4" />

      <h3 className="text-xl font-bold mb-2">
        {title}
      </h3>

      <p className="text-gray-600 mb-4">
        {description}
      </p>

      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
        {status}
      </span>
    </div>
  );
}