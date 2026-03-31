"use client";

import RiskBadge from "../requests/RiskBadge";
import { useState } from "react";

type Props = {
  requester: string;
  action: string;
  risk: "low" | "medium" | "high";
  reason: string;
};

export default function ApprovalCard({
  requester,
  action,
  risk,
  reason,
}: Props) {
  const [status, setStatus] = useState("Pending");

  return (
    <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-white">{action}</h3>
        <RiskBadge level={risk} />
      </div>

      <p className="text-sm text-gray-400">
        Requested by: {requester}
      </p>

      <p className="text-sm text-gray-400 mb-3">
        {reason}
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => setStatus("Approved")}
          className="px-3 py-1 bg-green-600 rounded hover:bg-green-500"
        >
          Approve
        </button>

        <button
          onClick={() => setStatus("Rejected")}
          className="px-3 py-1 bg-red-600 rounded hover:bg-red-500"
        >
          Reject
        </button>
      </div>

      <p className="text-sm mt-3">
        Status: <span className="text-blue-400">{status}</span>
      </p>
    </div>
  );
}