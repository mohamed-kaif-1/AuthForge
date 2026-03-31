import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "indigo" | "green" | "red" | "yellow";
}

export default function StatusCard({ title, value, icon: Icon, trend, trendUp, color = "indigo" }: StatusCardProps) {
  const colorMap = {
    indigo: "text-indigo-400 bg-indigo-500/10",
    green: "text-green-400 bg-green-500/10",
    red: "text-red-400 bg-red-500/10",
    yellow: "text-yellow-400 bg-yellow-500/10",
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-sm hover:border-gray-700 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 font-medium text-sm">{title}</h3>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-100">{value}</span>
        {trend && (
          <span className={`text-sm font-medium ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}