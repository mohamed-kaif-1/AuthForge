import ApprovalCard from "../../components/approvals/ApprovalCard";

export default function ApprovalsPage() {
    const approvals = [
        {
            requester: "Merlin",
            action: "Merge Production PR",
            risk: "high" as const,
            reason: "Deploy latest update to production",
        },
        {
            requester: "Alice",
            action: "Delete Inactive Users",
            risk: "medium" as const,
            reason: "Cleanup unused accounts",
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">
                Approval Inbox
            </h1>

            <div className="grid gap-4">
                {approvals.map((item, index) => (
                    <ApprovalCard key={index} {...item} />
                ))}
            </div>
        </div>
    );
}