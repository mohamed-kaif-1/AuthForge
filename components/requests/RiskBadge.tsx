type Props = {
  level: "low" | "medium" | "high";
};

export default function RiskBadge({ level }: Props) {
  const styles = {
    low: "bg-green-500/10 text-green-400",
    medium: "bg-yellow-500/10 text-yellow-400",
    high: "bg-red-500/10 text-red-400",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${styles[level]}`}>
      {level.toUpperCase()}
    </span>
  );
}