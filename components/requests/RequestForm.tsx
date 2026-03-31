"use client";

import { useState } from "react";
import ActionCard from "./ActionCard";

type Action = {
  action: string;
  target: string;
  risk: "low" | "medium" | "high";
  approval: boolean;
  status: string;
};

export default function RequestForm() {
  const [input, setInput] = useState("");
  const [actions, setActions] = useState<Action[]>([]);

  const handleSubmit = () => {
    // Mock AI extraction logic
    const mockData: Action[] = [
      {
        action: "Send Email",
        target: "All Customers",
        risk: "low",
        approval: false,
        status: "Executed",
      },
      {
        action: "Merge PR",
        target: "Production Repo",
        risk: "high",
        approval: true,
        status: "Pending Approval",
      },
    ];

    setActions(mockData);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
        <textarea
          placeholder="Enter your request..."
          className="w-full p-3 rounded bg-gray-800 text-white outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          Submit Request
        </button>
      </div>

      {/* Extracted Actions */}
      {actions.length > 0 && (
        <div className="grid gap-4">
          {actions.map((item, index) => (
            <ActionCard key={index} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}