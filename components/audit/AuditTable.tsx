type Log = {
  time: string;
  user: string;
  action: string;
  risk: "low" | "medium" | "high";
  decision: string;
  result: string;
};

const riskStyles = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-red-400",
};

export default function AuditTable({ logs }: { logs: Log[] }) {
  return (
    <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-gray-400 border-b border-gray-800">
          <tr>
            <th className="py-2">Time</th>
            <th>User</th>
            <th>Action</th>
            <th>Risk</th>
            <th>Decision</th>
            <th>Result</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, index) => (
            <tr
              key={index}
              className="border-b border-gray-800 hover:bg-gray-800"
            >
              <td className="py-2">{log.time}</td>
              <td>{log.user}</td>
              <td>{log.action}</td>
              <td className={riskStyles[log.risk]}>
                {log.risk.toUpperCase()}
              </td>
              <td>{log.decision}</td>
              <td>{log.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}