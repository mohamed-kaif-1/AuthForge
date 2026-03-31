import RiskBadge from "./RiskBadge";

type Props = {
  action: string;
  target: string;
  risk: "low" | "medium" | "high";
  approval: boolean;
  status: string;
};

export default function ActionCard({
  action,
  target,
  risk,
  approval,
  status,
}: Props) {
  return (
    <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-white">{action}</h3>
        <RiskBadge level={risk} />
      </div>

      <p className="text-sm text-gray-400 mb-2">
        Target: {target}
      </p>

      <p className="text-sm text-gray-400">
        Approval: {approval ? "Required" : "Not Required"}
      </p>

      <p className="text-sm mt-2">
        Status: <span className="text-blue-400">{status}</span>
      </p>
    </div>
  );
}