import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  color = "blue",
  onClick,
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };

  const trendIsPositive = trend > 0;
  const trendIsNegative = trend < 0;

  return (
    <div
      onClick={onClick}
      className={`card hover:shadow-md transition-all ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trendIsPositive
                ? "text-green-600"
                : trendIsNegative
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {trendIsPositive && <ArrowUpIcon className="w-4 h-4" />}
            {trendIsNegative && <ArrowDownIcon className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
        {trendLabel && (
          <p className="text-xs text-gray-400 mt-1">{trendLabel}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;