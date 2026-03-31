import AuditTable from "../../components/audit/AuditTable";

export default function AuditPage() {
    const logs = [
        {
            time: "10:30 AM",
            user: "Merlin",
            action: "Send Email",
            risk: "low" as const,
            decision: "Auto Approved",
            result: "Executed",
        },
        {
            time: "10:32 AM",
            user: "Merlin",
            action: "Merge Production PR",
            risk: "high" as const,
            decision: "Manager Approved",
            result: "Executed",
        },
        {
            time: "10:35 AM",
            user: "Alice",
            action: "Delete Users",
            risk: "medium" as const,
            decision: "Rejected",
            result: "Not Executed",
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">
                Audit Logs
            </h1>

            <AuditTable logs={logs} />
        </div>
    );
}